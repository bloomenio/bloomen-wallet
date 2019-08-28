
var SafeMath = artifacts.require("openzeppelin-solidity/contracts/math/SafeMath.sol");
var RLPReader = artifacts.require("solidity-rlp/contracts/RLPReader.sol");
var ERC223 = artifacts.require("bloomen-token/ERC223");

var Strings = artifacts.require("./dapp/lib/Strings.sol");
var Schemas = artifacts.require("./bloomen/Schemas");
var Assets = artifacts.require("./bloomen/Assets");

 module.exports = function(deployer) {
    var _erc223,_schemas;
    deployer
    .then(() => deployer.link(SafeMath, Assets))
    .then(() => deployer.link(RLPReader, Assets))
    .then(() => deployer.link(Strings, Assets))
    .then(() => ERC223.deployed())
    .then((instance) => {
      _erc223 = instance;
      return Schemas.deployed();   
    }).then((instance) => {
      _schemas = instance;
      return deployer.deploy(Assets, _schemas.address, _erc223.address);
    }).then((assets) => {
      return assets.addWhitelisted(_erc223.address);    
    });
 };


