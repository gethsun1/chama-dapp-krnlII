// src/test-env.js
console.log('KRNL Entry ID:', process.env.REACT_APP_KRNL_ENTRY_ID);
console.log('KRNL Access Token:', process.env.REACT_APP_KRNL_ACCESS_TOKEN);

// Export a function to check if we have valid credentials
export const checkKrnlCredentials = () => {
  const entryId = process.env.REACT_APP_KRNL_ENTRY_ID;
  const accessToken = process.env.REACT_APP_KRNL_ACCESS_TOKEN;
  
  console.log('Entry ID from env:', entryId);
  console.log('Access Token from env:', accessToken);
  
  return {
    entryId,
    accessToken,
    isValid: entryId && entryId !== '0x0000000000000000000000000000000000000000000000000000000000000000' &&
             accessToken && accessToken !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  };
};
