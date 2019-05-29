var MovementHistory = artifacts.require("./bloomen/token/MovementHistory.sol");
var BurnHistory = artifacts.require("./bloomen/token/BurnHistory.sol");

 module.exports = function(deployer) {
   deployer.deploy([MovementHistory,BurnHistory]);
 };
