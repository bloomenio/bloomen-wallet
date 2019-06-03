pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "../../../node_modules/openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";

contract BurnHistory is WhitelistedRole {

  struct Burn {
    uint256 id;
    address owner;
    address from;
    uint256 amount;
    uint date;
  }

  mapping (address => Burn[]) private burnsMap_;

  uint256 constant private PAGE_SIZE = 10;

  function addBurn(uint256 _amount, address _from) onlyWhitelisted public {
    burnsMap_[_from].push(Burn(burnsMap_[_from].length, msg.sender, _from, _amount, now));
  }

  function getBurnsPageCount() public returns (uint256) {
    return getBurnsPageCountFrom(msg.sender);
  }

  function getBurnsPageCountFrom(address from) public  returns (uint256) {
    uint256 pages = burnsMap_[from].length / PAGE_SIZE;
    if ( (burnsMap_[from].length  % PAGE_SIZE)>0) {
      pages++;
    }
    return pages;
  }

  function getBurns(uint256 _page) public returns (Burn[] memory) {
    return getBurnsFrom(_page, msg.sender);
  }

  function getBurnsFrom(uint256 _page, address from) public returns (Burn[] memory) {
    Burn[] memory burnsPage = new Burn[](PAGE_SIZE);
    uint256 transferIndex = PAGE_SIZE * _page - PAGE_SIZE;
    Burn[] memory burns = burnsMap_[from];

    if (burns.length == 0 || transferIndex > burns.length - 1) {
      Burn[] memory empty;
      return empty;
    }

    uint256 returnCounter = 0;

    for (transferIndex; transferIndex < PAGE_SIZE * _page; transferIndex++) {
      if (transferIndex < burns.length) {
        burnsPage[returnCounter] = burns[transferIndex];
      }
      returnCounter++;
    }

    return burnsPage;
  }

}