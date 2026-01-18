import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: {
    compilers: [
      { version: "0.8.19" }, // для MyToken.sol
      { version: "0.8.20" }, // для OpenZeppelin
      { version: "0.8.24" }  // для Lock.sol
    ]
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
