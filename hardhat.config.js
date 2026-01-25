import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: {
    compilers: [
      { version: "0.8.19" },
      { version: "0.8.20" }, 
      { version: "0.8.24" }  
    ]
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
