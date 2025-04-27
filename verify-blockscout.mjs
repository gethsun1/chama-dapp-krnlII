import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

async function verifyContract() {
  try {
    // Read the flattened contract
    const contractCode = fs.readFileSync('./TokenAuthority_flattened.sol', 'utf8');
    
    // Contract details
    const contractAddress = '0x043D8606399A3600Ba8fcA555273892b46680825';
    const contractName = 'TokenAuthority';
    const compilerVersion = 'v0.8.24+commit.e11b9ed9';
    
    // Create form data
    const formData = new FormData();
    formData.append('module', 'contract');
    formData.append('action', 'verify');
    formData.append('addressHash', contractAddress);
    formData.append('name', contractName);
    formData.append('compilerVersion', compilerVersion);
    formData.append('optimization', 'true');
    formData.append('optimizationRuns', '200');
    formData.append('contractSourceCode', contractCode);
    
    // Send verification request
    const response = await axios.post(
      'https://testnet.explorer.sapphire.oasis.dev/api',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    
    console.log('Verification response:', response.data);
  } catch (error) {
    console.error('Error verifying contract:', error.response ? error.response.data : error.message);
  }
}

verifyContract();
