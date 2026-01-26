import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("MyNFT (ERC-721)", function () {
  async function deployFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("MyNFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    return { nft, owner, addr1 };
  }

  it("Successful mint: onlyOwner can mint NFT", async function () {
    const { nft, owner, addr1 } = await deployFixture();

    await expect(nft.mintNFT(owner.address, "ipfs://metadata1.json"))
      .to.not.be.reverted;

    await expect(
      nft.connect(addr1).mintNFT(addr1.address, "ipfs://metadata2.json")
    ).to.be.reverted;
  });

  it("Ownership checks: ownerOf returns correct owner", async function () {
    const { nft, owner } = await deployFixture();

    await nft.mintNFT(owner.address, "ipfs://metadata1.json");

    expect(await nft.ownerOf(0)).to.equal(owner.address);
  });

  it("TokenURI retrieval: tokenURI returns correct URI", async function () {
    const { nft, owner } = await deployFixture();

    await nft.mintNFT(owner.address, "ipfs://metadata1.json");

    expect(await nft.tokenURI(0)).to.equal("ipfs://metadata1.json");
  });
});
