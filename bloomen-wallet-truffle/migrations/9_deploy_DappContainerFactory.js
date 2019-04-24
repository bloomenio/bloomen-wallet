var DappContainerFactory = artifacts.require("./jsw/DappContainerFactory");
var DappContainer = artifacts.require("./jsw/DappContainer");
var RLPReader = artifacts.require("../node_modules/solidity-rlp/contracts/RLPReader.sol");
var Strings = artifacts.require("./dapp/lib/Strings.sol");

module.exports = function(deployer,network) {
  deployer
  .then(()=>deployer.link(Strings, DappContainer))
  .then(()=>deployer.link(RLPReader, [DappContainer,DappContainerFactory]))
  .then(()=>deployer.deploy(DappContainerFactory))
  .then((containerFactory) => {
    return containerFactory.addWhitelisted(deployer.networks[network].from);    
  });
};


