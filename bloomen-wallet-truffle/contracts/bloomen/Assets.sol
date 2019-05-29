pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./Schemas.sol";
import "./token/ERC223ReceivingContract.sol";
import "./token/ERC223.sol";
import "../../node_modules/solidity-rlp/contracts/RLPReader.sol";
import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./dapp/lib/Strings.sol";

contract  Assets is ERC223ReceivingContract{
  
  using Strings for *;
  using SafeMath for uint256;
  using RLPReader for bytes;
  using RLPReader for uint;
  using RLPReader for RLPReader.RLPItem;

  struct DappCtx {
    string dappID;
    mapping (address => UserAssets)  userAssets_;    
  }

  struct UserAssets { 
    mapping (uint256 => uint) assetsIdx;  
    Asset[] assets;
  } 
  
  struct Asset {   
    uint expirationDate;
    uint256 assetId;
    uint256 schemaId;
    string dappId;
    string description;
  }

  uint256 constant private PAGE_SIZE = 10;

  mapping (bytes32 => uint[]) private dappCtxhashIndexMap_;
  DappCtx[] private dappCtxs_;

  Schemas private _schemas;
  ERC223 private _erc223;
  
  constructor (address _schemasAddr, address _erc223Addr) public{
    _erc223 = ERC223(_erc223Addr);
    _schemas = Schemas(_schemasAddr);
  }

  function removeAsset(uint256 assetId, string memory _dappId) public {
    _removeAsset(msg.sender, assetId,_dappId);
  }

  function checkOwnershipOneAsset(uint256 _assetId, uint256 _schemaId, string memory dappId) public  returns (bool) {
    return _checkOwnershipOneAsset(msg.sender, _assetId, _schemaId, dappId);  
  }

  function checkOwnershipMultipleAssets(uint256[] memory _assetsIds, uint256 _schemaId, string memory dappId) public  returns (bool[] memory) {
    return _checkOwnershipMultipleAssets(msg.sender, _assetsIds, _schemaId, dappId);  
  }

  function checkOwnershipOneAssetForAddress(address _target, uint256 _assetId, uint256 _schemaId, string memory dappId) public  returns (bool) {
    return _checkOwnershipOneAsset(_target, _assetId, _schemaId, dappId);  
  }

  function checkOwnershipMultipleAssetsForAddress(address _target, uint256[] memory _assetsIds, uint256 _schemaId, string memory dappId) public  returns (bool[] memory) {
    return _checkOwnershipMultipleAssets(_target, _assetsIds, _schemaId, dappId);  
  }

  function getAssetsPageCount(string memory dappId) public  returns (uint256) {  
    DappCtx storage ctx = _getDappCtx(dappId);  
    uint256 pages = ctx.userAssets_[msg.sender].assets.length / PAGE_SIZE;
    if ((ctx.userAssets_[msg.sender].assets.length % PAGE_SIZE)>0) {
      pages++;
    }
    return pages;
  }

  function getAssets(uint256 _page, string memory dappId) public  returns (Asset[] memory) {
    DappCtx storage ctx = _getDappCtx(dappId);  
    uint256 transferIndex = PAGE_SIZE * _page - PAGE_SIZE;
    Asset[] memory assets = ctx.userAssets_[msg.sender].assets;

    if (assets.length == 0 || transferIndex > assets.length - 1) {
      Asset[] memory empty;
      return empty ;
    }

    Asset[] memory assetsPage = new Asset[](PAGE_SIZE);  
    uint256 returnCounter = 0;

    for (transferIndex; transferIndex < PAGE_SIZE * _page; transferIndex++) {
      if (transferIndex < assets.length) {
        assetsPage[returnCounter] = assets[transferIndex];
      }
      returnCounter++;
    }

    return (assetsPage);
  }

  function tokenFallback(address _user, uint _amount, bytes memory _data) public {

    RLPReader.RLPItem memory item = _data.toRlpItem();
    RLPReader.RLPItem[] memory itemList = item.toList();

    uint256 _assetId = uint256(itemList[0].toUint());
    uint256 _schemaId = uint256(itemList[1].toUint());

    string memory _dappId = string(itemList[2].toBytes());

    DappCtx storage ctx = _getDappCtx(_dappId); 

    string memory _description = string(itemList[3].toBytes());

    Schemas.Schema memory schema = _schemas.getSchema(_schemaId);
    require(schema.amount <= _amount, "incorrect amount");    
    require(schema.topPrice >= _amount, "incorrect amount");    
    require(schema.dappId.toSlice().equals(_dappId.toSlice()),"incorrect dappId"); 

    if (schema.amount == schema.topPrice){
      // is not a tip
      require(!_checkOwnershipOneAsset(_user, _assetId, _schemaId,_dappId), "duplicated");
    }

    uint pieValue = _amount;

    for (uint i = 0; i < schema.clearingHouseRules.length-1; i++) {
      uint tmpValue = _calculatePercentage(_amount,schema.clearingHouseRules[i].percent);
      _erc223.transfer(schema.clearingHouseRules[i].receptor, tmpValue);
      pieValue -= tmpValue;
    }

    _erc223.transfer(schema.clearingHouseRules[schema.clearingHouseRules.length-1].receptor, pieValue);

    if (schema.amount == schema.topPrice){
      // is not a tip
      //  purchase registry
      ctx.userAssets_[_user].assets.push(Asset(now + schema.assetLifeTime , _assetId, _schemaId, _dappId, _description));
      ctx.userAssets_[_user].assetsIdx[_assetId] = ctx.userAssets_[_user].assets.length - 1 ;
    }
  }

  function _checkOwnershipMultipleAssets(address _owner, uint256[] memory _assetsIds, uint256 _schemaId, string memory _dappId) internal  returns (bool[] memory) {
        
    bool[] memory assetOwnerShip  = new bool[](_assetsIds.length);    

    for (uint i = 0; i < _assetsIds.length; i++) {
      assetOwnerShip[i] = _checkOwnershipOneAsset(_owner, _assetsIds[i] ,_schemaId, _dappId);
    }

    return assetOwnerShip;
  }

  function _checkOwnershipOneAsset(address _owner, uint256 _assetId, uint256 _schemaId, string memory _dappId) internal  returns (bool) {
    DappCtx storage ctx = _getDappCtx(_dappId);  
    
    if(ctx.userAssets_[_owner].assets.length == 0){
      return false;
    }

    uint idx = ctx.userAssets_[_owner].assetsIdx[_assetId];
    Asset memory asset = ctx.userAssets_[_owner].assets[idx];
    
    if ((asset.expirationDate > now) && (asset.assetId == _assetId) && (_dappId.toSlice().equals(asset.dappId.toSlice()))){
      return true;
    }
    else {
      return false;
    } 
  }

  function _calculatePercentage(uint theNumber, uint percentage) internal  returns (uint) {
    return theNumber * percentage / 100 ;
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

  function _removeAsset(address _owner, uint256 assetId, string memory _dappId) internal {
    DappCtx storage ctx = _getDappCtx(_dappId);
    require(ctx.userAssets_[_owner].assets.length>0, "empty user");
    
    uint assetIdx = ctx.userAssets_[_owner].assetsIdx[assetId];
    delete ctx.userAssets_[_owner].assetsIdx[assetId];

    delete ctx.userAssets_[_owner].assets[assetIdx];

    for (uint i = assetIdx; i < ctx.userAssets_[_owner].assets.length -1 ; i++) {
      ctx.userAssets_[_owner].assets[i] = ctx.userAssets_[_owner].assets[i+1];
    }
    ctx.userAssets_[_owner].assets.length--;
  }

}