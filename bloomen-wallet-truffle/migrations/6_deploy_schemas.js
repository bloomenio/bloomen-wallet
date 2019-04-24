
var RLPReader = artifacts.require("../node_modules/solidity-rlp/contracts/RLPReader.sol");
var Schemas = artifacts.require("./bloomen/Schemas");

module.exports = function(deployer,network) {
    deployer
    .then(() => deployer.link(RLPReader, Schemas))
    .then(() => {
        return deployer.deploy(Schemas);
    })
    .then((schemas) => {
        return schemas.addWhitelisted(deployer.networks[network].from);    
    });
    
 };
