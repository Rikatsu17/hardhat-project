const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60; // +60 секунд для примера

  const lockedAmount = hre.ethers.parseEther("0.001"); // 0.001 ETH

  // Деплой контракта Lock
  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment(); // ждем завершения деплоя

  console.log(
    `Lock with ${ethers.formatEther(lockedAmount)} ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
