const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

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
    formData.append('address', contractAddress);
    formData.append('name', contractName);
    formData.append('sourceCode', contractCode);
    formData.append('compilerVersion', compilerVersion);
    formData.append('optimization', 'true');
    formData.append('optimizationRuns', '200');
    
    // Send verification request
    const response = await axios.post(
      'https://testnet.explorer.sapphire.oasis.dev/api/contract/verify',
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
