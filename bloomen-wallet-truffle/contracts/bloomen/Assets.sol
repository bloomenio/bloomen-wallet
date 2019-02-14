pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "./Schemas.sol";
import "./token/ERC223ReceivingContract.sol";
import "./token/ERC223.sol";
import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract  Assets is Schemas, ERC223ReceivingContract, ERC223("BloomenCoin","BLO",2) {

  using SafeMath for uint256;
    
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

  // buy://<assetId>#<schemaId>#<amount>#<dappId>#amount

  mapping (address => UserAssets) private userAssets_;

  function checkOwnership(uint256 _assetId, uint256 _schemaId) public view returns (bool) {
    return _checkOwnership(msg.sender, _assetId, _schemaId);  
  }

  function checkOwnershipForAddress(address _target, uint256 _assetId, uint256 _schemaId) public view returns (bool) {
    return _checkOwnership(_target, _assetId, _schemaId);  
  }

  function buy(uint256 _assetId, uint256 _schemaId, uint256 _amount, string _dappId) public  {
    _buy(msg.sender, _assetId, _schemaId, _amount, _dappId, "");  
  }

  function buy(uint256 _assetId, uint256 _schemaId, uint256 _amount, string _dappId, string _description) public  {
    _buy(msg.sender, _assetId, _schemaId, _amount, _dappId, _description);  
  }

  function getAssetsPageCount() public view returns (uint256) {
    return userAssets_[msg.sender].assets.length / PAGE_SIZE;
  }

  function getAssets(uint256 _page) public view returns (Asset[] memory) {
    
    uint256 transferIndex = PAGE_SIZE * _page - PAGE_SIZE;
    Asset[] memory assets = userAssets_[msg.sender].assets;

    if (assets.length == 0 || transferIndex > assets.length - 1) {
      return;
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

  function _buy(address _user, uint256 _assetId, uint256 _schemaId, uint256 _amount, string _dappId, string _description) internal  {
    Schema memory schema = Schemas.getSchema(_schemaId);
    require(schema.amount == _amount, "incorrect amount");    
    require(!_checkOwnership(_user, _assetId, _schemaId), "duplicated");

    if (_amount >0 ){
      // avoid money transfer on free assets
      ERC223.transfer(this, _amount, _schemaId);
    }
  
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

  function tokenFallback(address _from, uint _value, uint256 _schemaId) public {
    Schema memory schema = Schemas.getSchema(_schemaId);
    uint pieValue = _value;

    for (uint i = 0; i < schema.clearingHouseRules.length-1; i++) {
      uint tmpValue = calculatePercentage(_value,schema.clearingHouseRules[i].percent);
      ERC223.transfer(schema.clearingHouseRules[i].receptor, tmpValue, 0);
      pieValue -= tmpValue;
    }

    ERC223.transfer(schema.clearingHouseRules[schema.clearingHouseRules.length-1].receptor, pieValue, 0);

  }

  function calculatePercentage(uint theNumber, uint percentage) public view returns (uint) {
    return theNumber * percentage / 100 ;
  }
    
}