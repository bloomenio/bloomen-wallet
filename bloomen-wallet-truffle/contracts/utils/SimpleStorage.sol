// File: `./contracts/SimpleStorage.sol`

pragma solidity ^0.4.17;

contract SimpleStorage {
  uint public storedData;

  constructor(uint initVal) public {
    storedData = initVal;
  }

  function set(uint x) public {
    storedData = x;
    emit ValueChanged(x);
  }

  function get() view public returns (uint retVal) {
    return storedData;
  }

  event ValueChanged(
    uint256 value
  );
}
