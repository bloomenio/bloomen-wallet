
var Devices = artifacts.require("./bloomen/Devices");
var Assets = artifacts.require("./bloomen/Assets");
var Strings = artifacts.require("./dapp/lib/Strings.sol");

module.exports = function(deployer) {
    var _assets;
     deployer
     .then(() => deployer.link(Strings, Devices))
     .then(() => Assets.deployed())
     .then((instance) => {
        _assets = instance;   
        return deployer.deploy(Devices,_assets.address);
      });    
 };
