var SafeMath = artifacts.require("../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol");
var Address = artifacts.require("../node_modules/openzeppelin-solidity/contracts/utils/Address.sol");
var MovementHistory = artifacts.require("./bloomen/token/MovementHistory.sol");
var BurnHistory = artifacts.require("./bloomen/token/BurnHistory.sol");
var ERC223 = artifacts.require("./bloomen/token/ERC223");

 module.exports = function(deployer) { 
  var _erc223, _movementHistory, _burnHistory ;    
  
     deployer
     .then(() => deployer.link(SafeMath, ERC223))
     .then(() => deployer.link(Address, ERC223))
     .then(() => MovementHistory.deployed())
     .then( (instance) => {  
        _movementHistory= instance;
        return BurnHistory.deployed();
     }).then((instance) => {  
        _burnHistory= instance;      
        return deployer.deploy(ERC223,"BloomenCoin","BLO",0,_movementHistory.address,_burnHistory.address);
     }).then((instance) => {        
        _erc223 = instance;
        return _movementHistory.addWhitelisted(_erc223.address);
      }).then(() => {        
        return _burnHistory.addWhitelisted(_erc223.address);
      });
     
 };
