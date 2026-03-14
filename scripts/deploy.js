const hre = require("hardhat");

async function main() {

  const EscrowFreelance = await hre.ethers.getContractFactory("EscrowFreelance");

  const escrow = await EscrowFreelance.deploy();

  await escrow.waitForDeployment();

  console.log("EscrowFreelance deployed to:", escrow.target);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});