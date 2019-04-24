
var Devices = artifacts.require("./bloomen/Devices");
var Assets = artifacts.require("./bloomen/Assets");

module.exports = function(deployer) {
    var _assets;
     deployer
     .then(() => Assets.deployed())
     .then((instance) => {
        _assets = instance;   
        return deployer.deploy(Devices,_assets.address);
      });    
 };
