import { ethers } from "hardhat";

async function main() {
  // Get the TokenAuthority address from command line arguments or use a default
  const tokenAuthorityAddress = process.env.TOKEN_AUTHORITY_ADDRESS;

  if (!tokenAuthorityAddress) {
    console.error("Please provide the TokenAuthority address as an environment variable: TOKEN_AUTHORITY_ADDRESS");
    process.exit(1);
  }

  console.log("Using TokenAuthority address:", tokenAuthorityAddress);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying ChamaFactory with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  // Deploy ChamaFactory to Ethereum Sepolia Testnet
  const ChamaFactory = await ethers.getContractFactory("ChamaFactory");
  const chamaFactory = await ChamaFactory.deploy(tokenAuthorityAddress);

  // Wait for the deployment to be mined
  await chamaFactory.waitForDeployment();

  console.log("ChamaFactory deployed to:", chamaFactory.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
