import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("Re-entrancy (Vulnerable vs Fixed)", function () {

  it("VulnerableBank should lose ETH due to re-entrancy attack", async function () {
    const [, user] = await ethers.getSigners();

    const Vulnerable = await ethers.getContractFactory("VulnerableBank");
    const bank = await Vulnerable.deploy();
    await bank.waitForDeployment();

    await bank.connect(user).deposit({ value: ethers.parseEther("5") });

    const Attacker = await ethers.getContractFactory("Attacker");
    const attacker = await Attacker.deploy(await bank.getAddress());
    await attacker.waitForDeployment();

    const bankBefore = await ethers.provider.getBalance(await bank.getAddress());
    console.log("VulnerableBank before:", ethers.formatEther(bankBefore));

    await attacker.attack({ value: ethers.parseEther("1") });

    const bankAfter = await ethers.provider.getBalance(await bank.getAddress());
    console.log("VulnerableBank after :", ethers.formatEther(bankAfter));

    expect(bankAfter).to.be.lt(bankBefore);
  });

  it("FixedBank should resist the re-entrancy attack", async function () {
    const [, user] = await ethers.getSigners();

    const Fixed = await ethers.getContractFactory("FixedBank");
    const bank = await Fixed.deploy();
    await bank.waitForDeployment();

    await bank.connect(user).deposit({ value: ethers.parseEther("5") });

    const Attacker = await ethers.getContractFactory("Attacker");
    const attacker = await Attacker.deploy(await bank.getAddress());
    await attacker.waitForDeployment();

    const bankBefore = await ethers.provider.getBalance(await bank.getAddress());
    console.log("FixedBank before:", ethers.formatEther(bankBefore));

    await expect(attacker.attack({ value: ethers.parseEther("1") })).to.be.reverted;

    const bankAfter = await ethers.provider.getBalance(await bank.getAddress());
    console.log("FixedBank after :", ethers.formatEther(bankAfter));

    expect(bankAfter).to.equal(bankBefore);
  });

});
