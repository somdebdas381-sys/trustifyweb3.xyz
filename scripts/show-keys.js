const { ethers } = require("hardhat");

async function main() {
  console.log("\n--- HARDHAT LOCAL ACCOUNTS & PRIVATE KEYS ---\n");
  const accounts = await ethers.getSigners();
  
  // These are the well-known Hardhat mnemonic keys
  const privateKeys = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    "0x47e17173e576973afb33e7461900f07c390bcd3800640c5d0642899aac74662d",
  ];

  for (let i = 0; i < 5; i++) {
    console.log(`Account #${i}: ${accounts[i].address}`);
    console.log(`Private Key: ${privateKeys[i]}`);
    console.log("--------------------------------------------------\n");
  }

  console.log("Use these keys to Import Account into MetaMask.");
  console.log("Make sure MetaMask is connected to Localhost 8545.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
