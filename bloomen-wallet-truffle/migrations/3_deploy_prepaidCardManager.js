
//var ERC223 = artifacts.require("./bloomen/token/ERC223");
var PrepaidCardManager = artifacts.require("./bloomen/PrepaidCardManager");

module.exports = function(deployer) {
  deployer.deploy(PrepaidCardManager);
};


