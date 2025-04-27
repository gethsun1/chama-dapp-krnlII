const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TokenAuthority with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());
  
  // Deploy TokenAuthority to Oasis Sapphire Testnet
  const TokenAuthority = await hre.ethers.getContractFactory("TokenAuthority");
  const tokenAuthority = await TokenAuthority.deploy();
  
  // Wait for the deployment to be mined
  await tokenAuthority.waitForDeployment();
  
  console.log("TokenAuthority deployed to:", tokenAuthority.target);
  console.log("Save this address to use when deploying ChamaFactory!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
