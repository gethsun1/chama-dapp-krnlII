require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-ignition");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
// Use alternative RPC endpoints
const SAPPHIRE_RPC = "https://testnet.sapphire.oasis.io";  // Correct endpoint
const SAPPHIRE_RPC_BACKUP = "https://testnet.sapphire.oasis.dev";  // Backup endpoint
const SEPOLIA_RPC = process.env.SEPOLIA_RPC;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  sourcify: {
    enabled: true
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true,
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    sapphire_testnet: {
      url: SAPPHIRE_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 23295,
      timeout: 60000, // Increase timeout to 60 seconds
      // Add these network parameters
      gasPrice: "auto",
      gas: "auto",
      // Add retry parameters
      httpHeaders: {
        "Connection": "keep-alive"
      },
      networkCheckTimeout: 100000,
      timeoutBlocks: 200,
      confirmations: 2,
    },
    // Add backup network
    sapphire_testnet_backup: {
      url: SAPPHIRE_RPC_BACKUP,
      accounts: [PRIVATE_KEY],
      chainId: 23295,
      timeout: 60000,
    },
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      sapphire_testnet: "no-api-key-needed"
    },
    customChains: [
      {
        network: "sapphire_testnet",
        chainId: 23295,
        urls: {
          apiURL: "https://testnet.explorer.sapphire.oasis.dev/api",
          browserURL: "https://testnet.explorer.sapphire.oasis.dev"
        }
      }
    ]
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  }
};
