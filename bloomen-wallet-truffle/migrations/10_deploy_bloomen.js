var Bloomen = artifacts.require("./bloomen/Bloomen");

 module.exports = function(deployer,network) {
   deployer
   .then(() => deployer.deploy(Bloomen))
   .then((bloomen) =>bloomen.addWhitelisted(deployer.networks[network].from));
 };

