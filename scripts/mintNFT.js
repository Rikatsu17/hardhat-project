import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const [owner] = await ethers.getSigners();
  const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const nft = await ethers.getContractAt("MyNFT", nftAddress);

  await nft.mintNFT(owner.address, "ipfs://metadata1.json");
  await nft.mintNFT(owner.address, "ipfs://metadata2.json");
  await nft.mintNFT(owner.address, "ipfs://metadata3.json");

  console.log("3 NFTs minted");
}
main().then(() => process.exit(0)).catch(console.error);
