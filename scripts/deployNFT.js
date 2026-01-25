import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const NFT = await ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();

  await nft.waitForDeployment();
  console.log("NFT deployed to:", await nft.getAddress());
}

main().then(() => process.exit(0)).catch(console.error);
