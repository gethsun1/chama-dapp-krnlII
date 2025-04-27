// src/contracts/ChamaFactoryConfig.js
import ChamaFactoryABI from './ChamaFactoryABI.json';

// Sepolia testnet deployment (updated)
const contractAddress = "0x4c03E26aBE5E1d14Adf3108b123D06148Ea906fd";

// Network-specific addresses
const addresses = {
  // Ethereum Sepolia Testnet (updated)
  11155111: "0x4c03E26aBE5E1d14Adf3108b123D06148Ea906fd",
  // Sapphire Testnet - TokenAuthority deployment
  23295: "0x043D8606399A3600Ba8fcA555273892b46680825"
};

export { ChamaFactoryABI, contractAddress, addresses };
