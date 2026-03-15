const { ethers } = require("hardhat");

async function main() {
    const signers = await ethers.getSigners();
    for (let i = 0; i < 3; i++) {
        const balance = await ethers.provider.getBalance(signers[i].address);
        console.log(`Account ${i} (${signers[i].address}): ${ethers.formatEther(balance)} ETH`);
    }
}

main().catch(console.error);
