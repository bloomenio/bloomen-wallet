require('dotenv').config();


module.exports = {
  scripts: {
    development: 'truffle migrate --reset ',
    export: 'copyfiles -f build/contracts/*.json ../bloomen-wallet-app/src/providers/services/web3/contracts/json &&  copyfiles -f build/contracts/*.json ../bloomen-wallet-service-demo/src/providers/services/web3/contracts/json && copyfiles -f build/contracts/*.json ../bloomen-wallet-cli/src/contracts'
  }
};