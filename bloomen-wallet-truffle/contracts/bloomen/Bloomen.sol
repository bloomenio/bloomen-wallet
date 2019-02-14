pragma solidity ^0.4.23;

import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Bloomen is Ownable{

  address[] private _dapps;


  function addDapp(address _dappAddress) onlyOwner public {
    _dapps.push(_dappAddress);
  }

  function deleteDapp(uint _index) onlyOwner public {
    for (uint i = _index; i < _dapps.length-1;i++){
      _dapps[i] = _dapps[i+1];
    }
    _dapps.length--;
  }

  function setDapp(uint _index, address _newAddress) onlyOwner public {
    _dapps[_index]=_newAddress;
  }

  function getDapps() view public returns(address[]) {
    return _dapps;
  }



}