const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying ChamaFactory with account:", deployer.address);
  console.log("Network:", hre.network.name);

  // Use the TokenAuthority address from Sapphire testnet for now
  // We'll deploy to Sepolia, but we're using the existing TokenAuthority address
  const tokenAuthorityAddress = "0x96c0Fb5F1f4668e5Ce80A486a6aA50D93E1EFA9d";

  console.log("Using TokenAuthority at:", tokenAuthorityAddress);

  const ChamaFactory = await hre.ethers.getContractFactory("UpdatedChamaFactory");
  const chamaFactory = await ChamaFactory.deploy(tokenAuthorityAddress);

  await chamaFactory.waitForDeployment();

  console.log("ChamaFactory deployed to:", chamaFactory.target);

  // Verify the contract
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: chamaFactory.target,
      constructorArguments: [tokenAuthorityAddress]
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
