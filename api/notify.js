// api/notify.js
import sgMail from '@sendgrid/mail';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Expecting the request body to contain the new Chama details.
  const {
    chamaName,
    description,
    depositAmount,
    contributionAmount,
    cycleDuration,
    penalty,
  } = req.body;

  if (!chamaName || !description || !depositAmount || !contributionAmount || !cycleDuration || penalty === undefined) {
    res.status(400).json({ error: 'Missing required Chama details in the request body' });
    return;
  }

 
  const filePath = path.join(process.cwd(), 'api', 'subscribers.json');
  let subscribers = [];
  
  if (existsSync(filePath)) {
    try {
      const data = readFileSync(filePath, 'utf-8');
      subscribers = JSON.parse(data);
    } catch (error) {
      console.error("Error reading subscribers file:", error);
      res.status(500).json({ error: 'Error reading subscribers file' });
      return;
    }
  }

  if (subscribers.length === 0) {
    res.status(200).json({ message: 'No subscribers found. No emails sent.' });
    return;
  }

  const joinChamaUrl = 'https://chama-dapp.vercel.app/join-chama';

  // Prepare the email message for all subscribers.
  const msg = {
    to: subscribers,
    from: process.env.SENDGRID_FROM_EMAIL, 
    subject: `New Chama Created: ${chamaName}`,
    text: `A new Chama has been created!
    
Chama Name: ${chamaName}
Description: ${description}
Deposit Amount: ${depositAmount} ETH
Contribution Amount: ${contributionAmount} ETH
Cycle Duration: ${cycleDuration}
Penalty: ${penalty}%

Join Chama via this link: ${joinChamaUrl}`,
    html: `<p>A new Chama has been created!</p>
    <ul>
      <li><strong>Chama Name:</strong> ${chamaName}</li>
      <li><strong>Description:</strong> ${description}</li>
      <li><strong>Deposit Amount:</strong> ${depositAmount} ETH</li>
      <li><strong>Contribution Amount:</strong> ${contributionAmount} ETH</li>
      <li><strong>Cycle Duration:</strong> ${cycleDuration}</li>
      <li><strong>Penalty:</strong> ${penalty}%</li>
    </ul>
    <p><a href="${joinChamaUrl}" style="color: #1a73e8; text-decoration: underline;">Join Chama Now</a></p>`,
  };

  try {
    await sgMail.sendMultiple(msg);
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: 'Error sending emails' });
  }
}
