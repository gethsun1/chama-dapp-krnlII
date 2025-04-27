const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TokenAuthority with account:", deployer.address);
  console.log("Network:", hre.network.name);

  const TokenAuthority = await hre.ethers.getContractFactory("TokenAuthority");
  const tokenAuthority = await TokenAuthority.deploy();

  await tokenAuthority.waitForDeployment();

  console.log("TokenAuthority deployed to:", tokenAuthority.target);

  // Verify the contract
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: tokenAuthority.target,
      constructorArguments: []
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });