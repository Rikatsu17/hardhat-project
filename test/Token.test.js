import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("MyToken (ERC-20)", function () {
  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    return { token, owner, addr1, addr2 };
  }

  it("Should set initial supply to owner (1000 tokens)", async function () {
    const { token, owner } = await deployFixture();

    const decimals = await token.decimals();
    const ownerBal = await token.balanceOf(owner.address);

    expect(ownerBal).to.equal(ethers.parseUnits("1000", decimals));
  });

  it("Minting: onlyOwner can mint", async function () {
    const { token, owner, addr1 } = await deployFixture();

    const decimals = await token.decimals();

    await expect(token.mint(addr1.address, ethers.parseUnits("10", decimals)))
      .to.not.be.reverted;

    await expect(
      token.connect(addr1).mint(addr1.address, ethers.parseUnits("10", decimals))
    ).to.be.reverted; 
  });

  it("Transfers: owner can transfer tokens to another address", async function () {
    const { token, owner, addr1 } = await deployFixture();

    const decimals = await token.decimals();

    await expect(token.transfer(addr1.address, ethers.parseUnits("25", decimals)))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr1.address, ethers.parseUnits("25", decimals));

    const bal1 = await token.balanceOf(addr1.address);
    expect(bal1).to.equal(ethers.parseUnits("25", decimals));
  });

  it("Revert: transfer should fail if sender has 0 balance", async function () {
    const { token, addr1, addr2 } = await deployFixture();

    const decimals = await token.decimals();

    await expect(
      token.connect(addr1).transfer(addr2.address, ethers.parseUnits("1", decimals))
    )
      .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  it("Approval & allowance: approve sets allowance correctly", async function () {
    const { token, owner, addr1 } = await deployFixture();

    const decimals = await token.decimals();

    await expect(token.approve(addr1.address, ethers.parseUnits("50", decimals)))
      .to.emit(token, "Approval")
      .withArgs(owner.address, addr1.address, ethers.parseUnits("50", decimals));

    const allowance = await token.allowance(owner.address, addr1.address);
    expect(allowance).to.equal(ethers.parseUnits("50", decimals));
  });

  it("transferFrom: approved spender can transfer tokens", async function () {
    const { token, owner, addr1, addr2 } = await deployFixture();

    const decimals = await token.decimals();

    await token.approve(addr1.address, ethers.parseUnits("30", decimals));

    await expect(
      token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("10", decimals))
    )
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr2.address, ethers.parseUnits("10", decimals));

    const bal2 = await token.balanceOf(addr2.address);
    expect(bal2).to.equal(ethers.parseUnits("10", decimals));

    const remaining = await token.allowance(owner.address, addr1.address);
    expect(remaining).to.equal(ethers.parseUnits("20", decimals));
  });

  it("Revert: transferFrom should fail if no allowance", async function () {
    const { token, owner, addr1, addr2 } = await deployFixture();

    const decimals = await token.decimals();

    await expect(
      token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("1", decimals))
    )
      .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
  });
});
