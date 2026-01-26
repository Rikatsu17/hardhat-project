import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const Voting = await ethers.getContractFactory("VotingWorkflow");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", await voting.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
