// src/services/krnlService.js
import { ethers } from 'krnl-sdk';

// KRNL RPC endpoint
const KRNL_RPC_URL = 'https://v0-0-1-rpc.node.lat';

// You need to get these values from KRNL after registering your dApp
// We'll get them directly from process.env when needed

// Get credentials from environment variables
// You need to set these in your .env.local file
// REACT_APP_KRNL_ENTRY_ID=your_entry_id
// REACT_APP_KRNL_ACCESS_TOKEN=your_access_token

// Helper function to check if we have valid KRNL credentials
const hasValidKrnlCredentials = () => {
  // Get from environment variables
  const entryId = process.env.REACT_APP_KRNL_ENTRY_ID;
  const accessToken = process.env.REACT_APP_KRNL_ACCESS_TOKEN;

  console.log('Credentials check:');
  console.log('Entry ID:', entryId ? `${entryId.substring(0, 10)}...` : 'Missing');
  console.log('Access Token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'Missing');

  return entryId && entryId.length >= 66 &&
         accessToken && accessToken.length >= 10;
};

// Initialize provider
const getKrnlProvider = () => {
  const provider = new ethers.JsonRpcProvider(KRNL_RPC_URL);
  return provider;
};

/**
 * Generate a KrnlPayload for the createChama function
 * @param {object} signer - Ethers signer
 * @param {object} params - Parameters for the createChama function
 * @returns {Promise<object>} - KrnlPayload object
 */
export const generateCreateChamaPayload = async (signer, params) => {
  try {
    // Check if we have valid KRNL credentials
    if (!hasValidKrnlCredentials()) {
      console.warn('Missing or invalid KRNL credentials. You need to register your dApp with KRNL first.');
      throw new Error('Missing or invalid KRNL credentials');
    }

    const provider = getKrnlProvider();
    const walletAddress = await signer.getAddress();

    const abiCoder = new ethers.AbiCoder();

    // Use the Oracle kernel (875) as specified in the updated TokenAuthority contract

    // Get the current ETH price in USD (mock value for testing)
    const ethUsdPrice = 3000; // Mock ETH/USD price (e.g., $3000 per ETH)

    // Encode the ETH/USD price for the Oracle kernel
    const parameterForKernel875 = abiCoder.encode(
      ["uint256"],
      [ethUsdPrice]
    );

    // Prepare kernel request data with the Oracle kernel
    const kernelRequestData = {
      senderAddress: walletAddress,
      kernelPayload: {
        "875": { // Oracle kernel
          functionParams: parameterForKernel875
        }
      }
    };

    // Encode function parameters for createChama
    const {
      chamaName,
      description,
      depositAmount,
      contributionAmount,
      penalty,
      maxMembers,
      cycleDuration
    } = params;

    const functionParams = abiCoder.encode(
      ["string", "string", "uint256", "uint256", "uint256", "uint256", "uint256"],
      [
        chamaName,
        description,
        depositAmount,
        contributionAmount,
        penalty,
        maxMembers,
        cycleDuration
      ]
    );

    // Execute kernels to get the payload
    console.log('Executing KRNL kernels...');
    try {
      // Get credentials from environment variables
      const entryId = process.env.REACT_APP_KRNL_ENTRY_ID;
      const accessToken = process.env.REACT_APP_KRNL_ACCESS_TOKEN;

      console.log('Using KRNL credentials:');
      console.log('Entry ID:', entryId ? `${entryId.substring(0, 10)}...` : 'Missing');
      console.log('Access Token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'Missing');
      console.log('Kernel Request Data:', JSON.stringify(kernelRequestData, null, 2));
      console.log('Function Params:', functionParams);

      try {
        const krnlPayload = await provider.executeKernels(
          entryId,
          accessToken,
          kernelRequestData,
          functionParams
        );

        console.log('KRNL payload generated:', krnlPayload);

        // Format the payload for the contract
        return {
          auth: krnlPayload.auth,
          kernelResponses: krnlPayload.kernel_responses,
          kernelParams: krnlPayload.kernel_params
        };
      } catch (execError) {
        console.error('KRNL executeKernels error:', execError);

        // Try with a simpler approach - empty function params
        console.log('Trying with empty function params...');
        try {
          const simpleKrnlPayload = await provider.executeKernels(
            entryId,
            accessToken,
            kernelRequestData,
            "0x" // Empty function params
          );

          console.log('Simple KRNL payload generated:', simpleKrnlPayload);

          // Format the payload for the contract
          return {
            auth: simpleKrnlPayload.auth,
            kernelResponses: simpleKrnlPayload.kernel_responses,
            kernelParams: simpleKrnlPayload.kernel_params
          };
        } catch (simpleError) {
          console.error('Simple KRNL executeKernels error:', simpleError);
          throw new Error(`KRNL execution failed with both approaches: ${execError.message}`);
        }
      }
    } catch (krnlError) {
      console.error('Error executing KRNL kernels:', krnlError);
      throw new Error(`KRNL execution failed: ${krnlError.message}`);
    }
  } catch (error) {
    console.error('Error generating KRNL payload:', error);
    throw error;
  }
};

/**
 * Generate a KrnlPayload for the joinChama function
 * @param {object} signer - Ethers signer
 * @param {number} chamaId - ID of the Chama to join
 * @returns {Promise<object>} - KrnlPayload object
 */
export const generateJoinChamaPayload = async (signer, chamaId) => {
  try {
    const provider = getKrnlProvider();
    const walletAddress = await signer.getAddress();

    const abiCoder = new ethers.AbiCoder();

    // Use the Oracle kernel (875) as specified in the updated TokenAuthority contract

    // Get the current ETH price in USD (mock value for testing)
    const ethUsdPrice = 3000; // Mock ETH/USD price (e.g., $3000 per ETH)

    // Encode the ETH/USD price for the Oracle kernel
    const parameterForKernel875 = abiCoder.encode(
      ["uint256"],
      [ethUsdPrice]
    );

    // Prepare kernel request data with the Oracle kernel
    const kernelRequestData = {
      senderAddress: walletAddress,
      kernelPayload: {
        "875": { // Oracle kernel
          functionParams: parameterForKernel875
        }
      }
    };

    // Encode function parameters for joinChama
    const functionParams = abiCoder.encode(
      ["uint256"],
      [chamaId]
    );

    // Get credentials from environment variables
    const entryId = process.env.REACT_APP_KRNL_ENTRY_ID;
    const accessToken = process.env.REACT_APP_KRNL_ACCESS_TOKEN;

    // Execute kernels to get the payload
    const krnlPayload = await provider.executeKernels(
      entryId,
      accessToken,
      kernelRequestData,
      functionParams
    );

    // Format the payload for the contract
    return {
      auth: krnlPayload.auth,
      kernelResponses: krnlPayload.kernel_responses,
      kernelParams: krnlPayload.kernel_params
    };
  } catch (error) {
    console.error('Error generating KRNL payload for joinChama:', error);
    throw error;
  }
};

/**
 * Generate a KrnlPayload for the contribute function
 * @param {object} signer - Ethers signer
 * @param {number} chamaId - ID of the Chama to contribute to
 * @returns {Promise<object>} - KrnlPayload object
 */
export const generateContributePayload = async (signer, chamaId) => {
  try {
    const provider = getKrnlProvider();
    const walletAddress = await signer.getAddress();

    const abiCoder = new ethers.AbiCoder();

    // Use the Oracle kernel (875) as specified in the updated TokenAuthority contract

    // Get the current ETH price in USD (mock value for testing)
    const ethUsdPrice = 3000; // Mock ETH/USD price (e.g., $3000 per ETH)

    // Encode the ETH/USD price for the Oracle kernel
    const parameterForKernel875 = abiCoder.encode(
      ["uint256"],
      [ethUsdPrice]
    );

    // Prepare kernel request data with the Oracle kernel
    const kernelRequestData = {
      senderAddress: walletAddress,
      kernelPayload: {
        "875": { // Oracle kernel
          functionParams: parameterForKernel875
        }
      }
    };

    // Encode function parameters for contribute
    const functionParams = abiCoder.encode(
      ["uint256"],
      [chamaId]
    );

    // Get credentials from environment variables
    const entryId = process.env.REACT_APP_KRNL_ENTRY_ID;
    const accessToken = process.env.REACT_APP_KRNL_ACCESS_TOKEN;

    // Execute kernels to get the payload
    const krnlPayload = await provider.executeKernels(
      entryId,
      accessToken,
      kernelRequestData,
      functionParams
    );

    // Format the payload for the contract
    return {
      auth: krnlPayload.auth,
      kernelResponses: krnlPayload.kernel_responses,
      kernelParams: krnlPayload.kernel_params
    };
  } catch (error) {
    console.error('Error generating KRNL payload for contribute:', error);
    throw error;
  }
};

/**
 * Generate a KrnlPayload for the payout function
 * @param {object} signer - Ethers signer
 * @param {number} chamaId - ID of the Chama to payout
 * @returns {Promise<object>} - KrnlPayload object
 */
export const generatePayoutPayload = async (signer, chamaId) => {
  try {
    const provider = getKrnlProvider();
    const walletAddress = await signer.getAddress();

    const abiCoder = new ethers.AbiCoder();

    // Use the Oracle kernel (875) as specified in the updated TokenAuthority contract

    // Get the current ETH price in USD (mock value for testing)
    const ethUsdPrice = 3000; // Mock ETH/USD price (e.g., $3000 per ETH)

    // Encode the ETH/USD price for the Oracle kernel
    const parameterForKernel875 = abiCoder.encode(
      ["uint256"],
      [ethUsdPrice]
    );

    // Prepare kernel request data with the Oracle kernel
    const kernelRequestData = {
      senderAddress: walletAddress,
      kernelPayload: {
        "875": { // Oracle kernel
          functionParams: parameterForKernel875
        }
      }
    };

    // Encode function parameters for payout
    const functionParams = abiCoder.encode(
      ["uint256"],
      [chamaId]
    );

    // Get credentials from environment variables
    const entryId = process.env.REACT_APP_KRNL_ENTRY_ID;
    const accessToken = process.env.REACT_APP_KRNL_ACCESS_TOKEN;

    // Execute kernels to get the payload
    const krnlPayload = await provider.executeKernels(
      entryId,
      accessToken,
      kernelRequestData,
      functionParams
    );

    // Format the payload for the contract
    return {
      auth: krnlPayload.auth,
      kernelResponses: krnlPayload.kernel_responses,
      kernelParams: krnlPayload.kernel_params
    };
  } catch (error) {
    console.error('Error generating KRNL payload for payout:', error);
    throw error;
  }
};
