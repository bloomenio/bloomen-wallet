pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./Assets.sol";

contract Devices {

  using Strings for *;

  struct DappCtx {
    string dappID;
    mapping (address => UserDevices)  userDevices_;
    mapping (bytes32 => address)  deviceHashes_;
  }

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

  mapping (bytes32 => uint[]) private dappCtxhashIndexMap_;
  DappCtx[] private dappCtxs_;

  Assets private _assets;
  
  constructor (address _assetsAddr) public{
    _assets = Assets(_assetsAddr);    
  }
    
  function isAllowed(bytes32 _deviceHash, string memory dappId) public  returns (bool) {
    DappCtx storage ctx = _getDappCtx(dappId);
    bool allowed = ctx.userDevices_[ctx.deviceHashes_[_deviceHash]].devices[_deviceHash].expirationDate > now ;
    return allowed;
  }

  function isAllowedForAddress(address _target, bytes32 _deviceHash, string memory dappId) public  returns (bool) {
    DappCtx storage ctx = _getDappCtx(dappId);
    bool allowed =  (ctx.deviceHashes_[_deviceHash] == _target) && (isAllowed(_deviceHash,dappId));
    return allowed;
  }

  function checkOwnershipForDeviceMultipleAssets(bytes32 _deviceHash, uint256[] memory _assetIds, string memory dappId) public  returns (bool[] memory) {
    DappCtx storage ctx = _getDappCtx(dappId);
    require(ctx.deviceHashes_[_deviceHash] != address(0), "not exist");
    require(_assetIds.length > 0, "empty assets");
    
    Device memory device = ctx.userDevices_[ctx.deviceHashes_[_deviceHash]].devices[_deviceHash];

    return _assets.checkOwnershipMultipleAssetsForAddress(ctx.deviceHashes_[_deviceHash],_assetIds,device.schemaId,device.dappId);
  }

  function checkOwnershipOneAssetForDevice(bytes32 _deviceHash, uint256 _assetId, string memory dappId) public  returns (bool) {
    DappCtx storage ctx = _getDappCtx(dappId);
    require(ctx.deviceHashes_[_deviceHash] != address(0), "not exist");
    
    Device storage device = ctx.userDevices_[ctx.deviceHashes_[_deviceHash]].devices[_deviceHash];

    return _assets.checkOwnershipOneAssetForAddress(ctx.deviceHashes_[_deviceHash],_assetId,device.schemaId,device.dappId);
  }

  function getDevicesPageCount(string memory dappId) public  returns (uint256) {
    DappCtx storage ctx = _getDappCtx(dappId);    
    uint256 pages = ctx.userDevices_[msg.sender].deviceArray.length / PAGE_SIZE;
    if ( (ctx.userDevices_[msg.sender].deviceArray.length % PAGE_SIZE)>0) {
      pages++;
    }
    return pages;
  }

  function getDevices(uint256 _page, string memory dappId) public  returns (Device[] memory) {
    DappCtx storage ctx = _getDappCtx(dappId); 
    Device[] memory devicesPage = new Device[](PAGE_SIZE); 
    uint256 transferIndex = PAGE_SIZE * _page - PAGE_SIZE;
    bytes32[] memory devices = ctx.userDevices_[msg.sender].deviceArray;

    if (devices.length == 0 || transferIndex > devices.length - 1) {
      Device[] memory empty;
      return empty;
    }
   
    uint256 returnCounter = 0;

    for (transferIndex; transferIndex < PAGE_SIZE * _page; transferIndex++) {
      if (transferIndex < devices.length) {
        devicesPage[returnCounter] = ctx.userDevices_[msg.sender].devices[devices[transferIndex]];
      }
      returnCounter++;
    }
    return devicesPage;
  }

  function getAddress(bytes32 _deviceHash, string memory dappId) public  returns (address) {
    DappCtx storage ctx = _getDappCtx(dappId);
    bool allowed = isAllowed(_deviceHash,dappId);
    address ownerAddress;
    if (allowed) {
      ownerAddress = ctx.deviceHashes_[_deviceHash];
    } 
    return ownerAddress;
  }

  function handshake(bytes32 _deviceHash, uint256 _assetId, uint256 _schemaId, uint256 _lifeTime, string memory _dappId) public {
    _handshake(msg.sender, _deviceHash, _assetId, _schemaId, _lifeTime, _dappId, "");
  }

  function handshake(bytes32 _deviceHash, uint256 _assetId, uint256 _schemaId, uint256 _lifeTime, string memory _dappId, string memory _description) public {
    _handshake(msg.sender, _deviceHash, _assetId, _schemaId, _lifeTime, _dappId, _description);
  }

  function removeDevice(bytes32 _deviceHash, string memory _dappId) public {
    _removeDevice(msg.sender, _deviceHash,_dappId);
  }

    
  function _handshake(address _owner, bytes32 _deviceHash, uint256 _assetId, uint256 _schemaId, uint256 _lifeTime, string memory _dappId, string memory _description) internal {
    require(_assets.checkOwnershipOneAssetForAddress(_owner, _assetId, _schemaId, _dappId),"not allowed");
    DappCtx storage ctx = _getDappCtx(_dappId);

    if ((ctx.deviceHashes_[_deviceHash] != address(0)) && (!isAllowed(_deviceHash,_dappId))) {
      _removeDevice(ctx.deviceHashes_[_deviceHash], _deviceHash,_dappId);
    }

    require(ctx.deviceHashes_[_deviceHash] == address(0), "duplicated hash");
    ctx.deviceHashes_[_deviceHash] = _owner; 
    ctx.userDevices_[_owner].devices[_deviceHash] =  Device(_lifeTime, _assetId, _schemaId, _dappId, _description);
    ctx.userDevices_[_owner].deviceArray.push(_deviceHash);
  }

  function _removeDevice(address _owner, bytes32 _deviceHash, string memory _dappId) internal {
    DappCtx storage ctx = _getDappCtx(_dappId);
    require(ctx.deviceHashes_[_deviceHash] == _owner, "same owner");
    delete ctx.deviceHashes_[_deviceHash];
    delete ctx.userDevices_[_owner].devices[_deviceHash];
    bool found=false;
    for (uint i = 0; i < ctx.userDevices_[_owner].deviceArray.length-1;i++){
      if(found){
        ctx.userDevices_[_owner].deviceArray[i] = ctx.userDevices_[_owner].deviceArray[i+1];
      } else {
        found = ctx.userDevices_[_owner].deviceArray[i] == _deviceHash;
      }
    }
    delete ctx.userDevices_[_owner].deviceArray[ctx.userDevices_[_owner].deviceArray.length-1];
    ctx.userDevices_[_owner].deviceArray.length--;
  }

  function _getDappCtx(string memory dappId) internal returns (DappCtx storage) {
    bytes32 dappIdHash = keccak256(bytes(dappId));
    uint[] memory indexArray = dappCtxhashIndexMap_[dappIdHash];

    if (indexArray.length > 0) {
      // hash collision check
      for (uint i = 0 ; i < indexArray.length ; i++) {
        if (dappId.toSlice().equals(dappCtxs_[indexArray[i]].dappID.toSlice())) {
          return dappCtxs_[indexArray[i]];
        }
      }
    }

    dappCtxs_.push(DappCtx(dappId));
    uint dappIndex = dappCtxs_.length-1;

    dappCtxhashIndexMap_[dappIdHash].push(dappIndex);

    return dappCtxs_[dappIndex];
  }

}