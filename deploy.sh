#!/bin/bash

# Script to help with contract deployment using Yarn

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Chama DApp Deployment Script${NC}"
echo "----------------------------------------"

# Function to deploy TokenAuthority to Oasis Sapphire Testnet
deploy_token_authority() {
  echo -e "${YELLOW}Deploying TokenAuthority to Oasis Sapphire Testnet...${NC}"
  yarn hardhat run src/scripts/deploy-token-authority.cjs --network sapphire_testnet
  
  echo ""
  echo -e "${YELLOW}Please enter the deployed TokenAuthority address:${NC}"
  read token_authority_address
  
  # Export the address as an environment variable
  export TOKEN_AUTHORITY_ADDRESS=$token_authority_address
  echo -e "${GREEN}TokenAuthority address set to: $TOKEN_AUTHORITY_ADDRESS${NC}"
}

# Function to deploy ChamaFactory to Ethereum Sepolia Testnet
deploy_chama_factory() {
  if [ -z "$TOKEN_AUTHORITY_ADDRESS" ]; then
    echo -e "${YELLOW}TokenAuthority address not set. Please deploy TokenAuthority first.${NC}"
    deploy_token_authority
  fi
  
  echo -e "${YELLOW}Deploying ChamaFactory to Ethereum Sepolia Testnet...${NC}"
  echo -e "${YELLOW}Using TokenAuthority address: $TOKEN_AUTHORITY_ADDRESS${NC}"
  
  TOKEN_AUTHORITY_ADDRESS=$TOKEN_AUTHORITY_ADDRESS yarn hardhat run src/scripts/deploy-chama-factory.cjs --network sepolia
}

# Function to verify contracts
verify_contracts() {
  echo -e "${YELLOW}Verifying ChamaFactory on Ethereum Sepolia Testnet...${NC}"
  echo -e "${YELLOW}Please enter the deployed ChamaFactory address:${NC}"
  read chama_factory_address
  
  yarn hardhat verify --network sepolia $chama_factory_address $TOKEN_AUTHORITY_ADDRESS
}

# Main menu
echo "Select an option:"
echo "1) Deploy TokenAuthority to Oasis Sapphire Testnet"
echo "2) Deploy ChamaFactory to Ethereum Sepolia Testnet"
echo "3) Verify ChamaFactory on Ethereum Sepolia Testnet"
echo "4) Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    deploy_token_authority
    ;;
  2)
    deploy_chama_factory
    ;;
  3)
    verify_contracts
    ;;
  4)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid choice. Exiting..."
    exit 1
    ;;
esac

echo -e "${GREEN}Done!${NC}"
