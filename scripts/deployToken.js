import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();

    console.log("Token deployed to:", token.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});




