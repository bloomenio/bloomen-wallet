pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./Assets.sol";

contract Devices {

  struct UserDevices {   
    mapping (bytes32 => Device) devices;
    bytes32[] deviceArray;
  } 

  struct Device {   
    uint256 expirationDate;
    uint256 assetId;
    uint256 schemaId;
    string dappId;
    string description;
  }

  uint256 constant private PAGE_SIZE = 10;

  mapping (address => UserDevices) private userDevices_;

  mapping (bytes32 => address) private deviceHashes_;
 
  Assets private _assets;
  
  constructor (address _assetsAddr) public{
    _assets = Assets(_assetsAddr);    
  }
    
  function isAllowed(bytes32 _deviceHash) public view returns (bool) {
    bool allowed = userDevices_[deviceHashes_[_deviceHash]].devices[_deviceHash].expirationDate > now ;
    return allowed;
  }

  function isAllowedForAddress(address _target, bytes32 _deviceHash) public view returns (bool) {
    bool allowed =  (deviceHashes_[_deviceHash] == _target) && (isAllowed(_deviceHash));
    return allowed;
  }

  function getAssetsPageCount() public view returns (uint256) {    
    uint256 pages = userDevices_[msg.sender].deviceArray.length / PAGE_SIZE;
    if ( (userDevices_[msg.sender].deviceArray.length % PAGE_SIZE)>0) {
      pages++;
    }
    return pages;
  }

  function getDevices(uint256 _page) public view returns (Device[] memory) {
    Device[] memory devicesPage = new Device[](PAGE_SIZE); 
    uint256 transferIndex = PAGE_SIZE * _page - PAGE_SIZE;
    bytes32[] memory devices = userDevices_[msg.sender].deviceArray;

    if (devices.length == 0 || transferIndex > devices.length - 1) {
      Device[] memory empty;
      return empty;
    }
   
    uint256 returnCounter = 0;

    for (transferIndex; transferIndex < PAGE_SIZE * _page; transferIndex++) {
      if (transferIndex < devices.length) {
        devicesPage[returnCounter] = userDevices_[msg.sender].devices[devices[transferIndex]];
      }
      returnCounter++;
    }
    return devicesPage;
  }

  function getAddress(bytes32 _deviceHash) public view returns (address) {
    bool allowed = isAllowed(_deviceHash);
    address ownerAddress;
    if (allowed) {
      ownerAddress = deviceHashes_[_deviceHash];
    } 
    return ownerAddress;
  }

  function handshake(bytes32 _deviceHash, uint256 _assetId, uint256 _schemaId, uint256 _lifeTime, string memory _dappId) public {
    _handshake(msg.sender, _deviceHash, _assetId, _schemaId, _lifeTime, _dappId, "");
  }

  function handshake(bytes32 _deviceHash, uint256 _assetId, uint256 _schemaId, uint256 _lifeTime, string memory _dappId, string memory _description) public {
    _handshake(msg.sender, _deviceHash, _assetId, _schemaId, _lifeTime, _dappId, _description);
  }

  function removeDevice(bytes32 _deviceHash) public {
    _removeDevice(msg.sender, _deviceHash);
  }

    
  function _handshake(address _owner, bytes32 _deviceHash, uint256 _assetId, uint256 _schemaId, uint256 _lifeTime, string memory _dappId, string memory _description) internal {

    require(_assets.checkOwnershipForAddress(_owner, _assetId, _schemaId),"not allowed");

    if ((deviceHashes_[_deviceHash] != address(0)) && (!isAllowed(_deviceHash))) {
      _removeDevice(deviceHashes_[_deviceHash], _deviceHash);
    }

    require(deviceHashes_[_deviceHash] == address(0), "duplicated hash");
    deviceHashes_[_deviceHash] = _owner; 
    userDevices_[_owner].devices[_deviceHash] =  Device(_lifeTime, _assetId, _schemaId, _dappId, _description);
    userDevices_[_owner].deviceArray.push(_deviceHash);
  }

  function _removeDevice(address _owner, bytes32 _deviceHash) internal {
    require(deviceHashes_[_deviceHash] == _owner, "same owner");
    delete deviceHashes_[_deviceHash];
    delete userDevices_[_owner].devices[_deviceHash];
    bool found=false;
    for (uint i = 0; i < userDevices_[_owner].deviceArray.length-1;i++){
      if(found){
        userDevices_[_owner].deviceArray[i] = userDevices_[_owner].deviceArray[i+1];
      } else {
        found = userDevices_[_owner].deviceArray[i] == _deviceHash;
      }
    }
    delete userDevices_[_owner].deviceArray[userDevices_[_owner].deviceArray.length-1];
    userDevices_[_owner].deviceArray.length--;
  }

}