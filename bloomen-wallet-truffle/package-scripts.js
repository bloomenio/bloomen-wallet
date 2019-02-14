require('dotenv').config();


module.exports = {
  scripts: {
    development: 'truffle migrate --reset',
    export: 'copyfiles -f build/contracts/*.json ../bloomen-wallet-cli/src/providers/services/web3/contracts/json'
  }
};