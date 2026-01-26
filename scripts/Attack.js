import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [, user] = await ethers.getSigners();

  const Vulnerable = await ethers.getContractFactory("VulnerableBank");
  const bank = await Vulnerable.deploy();
  await bank.waitForDeployment();

  await bank.connect(user).deposit({ value: ethers.parseEther("5") });

  const Attacker = await ethers.getContractFactory("Attacker");
  const attacker = await Attacker.deploy(await bank.getAddress());
  await attacker.waitForDeployment();

  const before = await ethers.provider.getBalance(await bank.getAddress());
  console.log("VulnerableBank before:", ethers.formatEther(before));

  await attacker.attack({ value: ethers.parseEther("1") });

  const after = await ethers.provider.getBalance(await bank.getAddress());
  console.log("VulnerableBank after :", ethers.formatEther(after));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
