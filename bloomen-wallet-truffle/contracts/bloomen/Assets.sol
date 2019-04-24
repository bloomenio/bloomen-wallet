pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./Schemas.sol";
import "./token/ERC223ReceivingContract.sol";
import "./token/ERC223.sol";
import "../../node_modules/solidity-rlp/contracts/RLPReader.sol";
import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract  Assets is ERC223ReceivingContract{

  using SafeMath for uint256;
  using RLPReader for bytes;
  using RLPReader for uint;
  using RLPReader for RLPReader.RLPItem;
    
  struct UserAssets {   
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

  mapping (address => UserAssets) private userAssets_; 

  Schemas private _schemas;
  ERC223 private _erc223;
  
  constructor (address _schemasAddr, address _erc223Addr) public{
    _erc223 = ERC223(_erc223Addr);
    _schemas = Schemas(_schemasAddr);
  }

  function checkOwnership(uint256 _assetId, uint256 _schemaId) public view returns (bool) {
    return _checkOwnership(msg.sender, _assetId, _schemaId);  
  }

  function checkOwnershipForAddress(address _target, uint256 _assetId, uint256 _schemaId) public view returns (bool) {
    return _checkOwnership(_target, _assetId, _schemaId);  
  }

  function getAssetsPageCount() public view returns (uint256) {    
    uint256 pages = userAssets_[msg.sender].assets.length / PAGE_SIZE;
    if ((userAssets_[msg.sender].assets.length % PAGE_SIZE)>0) {
      pages++;
    }
    return pages;
  }

  function getAssets(uint256 _page) public view returns (Asset[] memory) {
    
    uint256 transferIndex = PAGE_SIZE * _page - PAGE_SIZE;
    Asset[] memory assets = userAssets_[msg.sender].assets;

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
    string memory _description = string(itemList[3].toBytes());

    Schemas.Schema memory schema = _schemas.getSchema(_schemaId);
    require(schema.amount == _amount, "incorrect amount");    
    require(!_checkOwnership(_user, _assetId, _schemaId), "duplicated");
    
    uint pieValue = _amount;

    for (uint i = 0; i < schema.clearingHouseRules.length-1; i++) {
      uint tmpValue = calculatePercentage(_amount,schema.clearingHouseRules[i].percent);
      _erc223.transfer(schema.clearingHouseRules[i].receptor, tmpValue);
      pieValue -= tmpValue;
    }

    _erc223.transfer(schema.clearingHouseRules[schema.clearingHouseRules.length-1].receptor, pieValue);
    // registrar la compra
    userAssets_[_user].assets.push(Asset(now + schema.assetLifeTime , _assetId, _schemaId, _dappId, _description));
  }

  function _checkOwnership(address _owner, uint256 _assetId, uint256 _schemaId) internal view returns (bool) {
    
    for (uint i = 0; i < userAssets_[_owner].assets.length; i++) {
      Asset memory asset = userAssets_[_owner].assets[i];

      if ( (asset.assetId == _assetId) && (asset.schemaId == _schemaId) && (asset.expirationDate > now)){
        return true;
      }
    }
    
    return false;
  }

  function calculatePercentage(uint theNumber, uint percentage) public view returns (uint) {
    return theNumber * percentage / 100 ;
  }
    
}