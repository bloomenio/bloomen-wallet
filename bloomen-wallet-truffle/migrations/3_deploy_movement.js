var MovementHistory = artifacts.require("./bloomen/token/MovementHistory.sol");

 module.exports = function(deployer) {
   deployer.deploy(MovementHistory);
 };
