
var ERC223 = artifacts.require("./bloomen/token/ERC223");
var PrepaidCardManager = artifacts.require("./bloomen/PrepaidCardManager");

module.exports = function(deployer,network) {
  var _erc223, _prepaidCardManager;
  deployer
  .then(() => ERC223.deployed())
  .then((instance) => {
    _erc223 = instance;   
    return deployer.deploy(PrepaidCardManager,_erc223.address);
  }).then((instance) => {
    _prepaidCardManager=instance;
    return _erc223.addMinter(_prepaidCardManager.address);
  }).then(() => {    
    return _prepaidCardManager.addWhitelisted(deployer.networks[network].from);    
  });
};
