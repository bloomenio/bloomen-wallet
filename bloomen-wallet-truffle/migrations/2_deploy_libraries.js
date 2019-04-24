var Address = artifacts.require("../node_modules/openzeppelin-solidity/contracts/utils/Address.sol");
var SafeMath = artifacts.require("../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol");
var RLPReader = artifacts.require("../node_modules/solidity-rlp/contracts/RLPReader.sol");
var Strings = artifacts.require("./dapp/lib/Strings.sol");

 module.exports = function(deployer) {
    deployer.deploy([SafeMath,RLPReader,Address,Strings]);
 };
