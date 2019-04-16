require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {

  networks: {

    development: {
      provider: () => new HDWalletProvider(process.env.DEVELOPMENT_MNEMONIC, process.env.DEVELOPMENT_URL),
      network_id: "*", // Match Alastria network id
      gasPrice: 0,
      type: "quorum"
     },
  },
  compilers: {
    solc: {
      version: '0.5.7',
    },
  }
};
