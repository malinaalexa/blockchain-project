require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/a7e097c4d4424bf1bf6797c6b7bfb675", // Înlocuiește cu Infura Project ID
      accounts: ["15e2b69a41e6fa001f2bfcbf934ac74da1bb129d93053ffcaa86fea0794bfb4c"], // Adaugă cheia privată a contului tău Ethereum
    },
  },
};
