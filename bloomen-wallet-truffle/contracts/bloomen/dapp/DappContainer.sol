pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./lib/Strings.sol";
import "../../../node_modules/solidity-rlp/contracts/RLPReader.sol";
import "../../../node_modules/openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";

contract DappContainer is WhitelistedRole {

  using Strings for *;
  using RLPReader for bytes;
  using RLPReader for uint;
  using RLPReader for RLPReader.RLPItem;

  struct PathValue {
        string path;
        string value;
        string valueType;
  }

  mapping (bytes32 => uint[]) private hashIndexMap_;

  PathValue[] private data_;

  function getData() public view returns (PathValue[] memory) {
    return data_;
  }
  
  function update(bytes memory _in) onlyWhitelisted public {
    
    RLPReader.RLPItem memory item = _in.toRlpItem();
    RLPReader.RLPItem[] memory itemList = item.toList();
    uint listLength = itemList.length;
    
    for (uint i = 0; i < listLength; i++) {
      uint difference = itemList[i].toList()[3].toUint();
      if (difference == 0) { //addition
        _addPath(string(itemList[i].toList()[0].toBytes()), string(itemList[i].toList()[1].toBytes()), string(itemList[i].toList()[2].toBytes()));
      } else if (difference == 1) { //deletion
        _deletePath(string(itemList[i].toList()[0].toBytes()));
      } else { //modification
        _modifyPath(string(itemList[i].toList()[0].toBytes()), string(itemList[i].toList()[1].toBytes()), string(itemList[i].toList()[2].toBytes()));
      }
    }
    
  }

  function initialize(PathValue[] memory _data) onlyWhitelisted public {
    uint dataLength = _data.length;
    for (uint i = 0;i < dataLength; i++) {
      PathValue memory pathValue = _data[i];
      _addPath(pathValue.path, pathValue.value, pathValue.valueType);
    }
  }

  function _addPath(string memory _path, string memory _value, string memory _valueType) internal {
    bytes32 pathHash = keccak256(bytes(_path));
    uint[] memory indexArray = hashIndexMap_[pathHash];
    if (indexArray.length > 0) {
      uint indexLength = indexArray.length;
      for (uint i = 0; i < indexLength; i++) {
        string memory storedPath = data_[indexArray[i]].path;
        require(!storedPath.toSlice().equals(_path.toSlice()), "Error: path already exists.");
      }
    }
    PathValue memory pathValue = PathValue(_path, _value, _valueType);
    uint dataLength = data_.length;
    for (uint8 i = 0; i < dataLength; i++) {
      if (data_[i].path.toSlice().empty()) {
        data_[i] = pathValue;
        hashIndexMap_[pathHash].push(i);
        return;
      }
    }
    data_.push(pathValue);
    hashIndexMap_[pathHash].push(data_.length - 1); 
  }

  function _deletePath(string memory _path) internal {
    bytes32 pathHash = keccak256(bytes(_path));
    uint[] memory indexArray = hashIndexMap_[pathHash];
    require(indexArray.length > 0, "Error: path does not exists.");
    uint indexLength = indexArray.length;
    for (uint i = 0; i < indexLength; i++) {
      string memory storedPath = data_[indexArray[i]].path;
      if (storedPath.toSlice().equals(_path.toSlice())) {
        delete data_[indexArray[i]];
        delete hashIndexMap_[pathHash];
      }
    }
  }

  function _modifyPath(string memory _path, string memory _value, string memory _valueType) internal {
    bytes32 pathHash = keccak256(bytes(_path));
    uint[] memory indexArray = hashIndexMap_[pathHash];
    require(indexArray.length > 0, "Error: path does not exists.");
    uint indexLength = indexArray.length;
    for (uint i = 0; i < indexLength; i++) {
      string memory storedPath = data_[indexArray[i]].path;
      if (storedPath.toSlice().equals(_path.toSlice())) {
        data_[indexArray[i]] = PathValue(_path, _value, _valueType);
        return;
      }
    }
  }

}