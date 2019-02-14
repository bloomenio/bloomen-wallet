var SimpleStorage = artifacts.require("./utils/SimpleStorage.sol");

 module.exports = function(deployer) {
   deployer.deploy(SimpleStorage,34);
 };

