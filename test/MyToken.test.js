import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("MyToken Contract", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;

  const initialSupply = ethers.parseUnits("1000", 18);

  beforeEach(async function () {
    Token = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2] = await ethers.getSigners();

    token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
  });

  it("Should assign total supply to owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(initialSupply);
  });

  it("Should transfer tokens between accounts", async function () {
    await token.transfer(addr1.address, 100);

    expect(await token.balanceOf(addr1.address)).to.equal(100);
    expect(await token.balanceOf(owner.address)).to.equal(
      initialSupply - 100n
    );
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    await expect(
      token.connect(addr1).transfer(owner.address, 1)
    ).to.be.reverted;
  });

  it("Should allow transfer to self without changing balance", async function () {
    const balanceBefore = await token.balanceOf(owner.address);

    await token.transfer(owner.address, 100);

    const balanceAfter = await token.balanceOf(owner.address);
    expect(balanceAfter).to.equal(balanceBefore);
  });

  it("Should emit Transfer event", async function () {
    await expect(token.transfer(addr1.address, 50))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr1.address, 50);
  });

  it("Should estimate gas for transfer", async function () {
    const gasEstimate = await token.transfer.estimateGas(addr1.address, 10);
    expect(gasEstimate).to.be.gt(0);
  });

  it("Should correctly store balances in contract storage", async function () {
    await token.transfer(addr1.address, 200);

    const storedBalance = await token.balanceOf(addr1.address);
    expect(storedBalance).to.equal(200);
  });

  it("Should revert when transferring to zero address", async function () {
    await expect(
      token.transfer(ethers.ZeroAddress, 10)
    ).to.be.reverted;
  });
});
