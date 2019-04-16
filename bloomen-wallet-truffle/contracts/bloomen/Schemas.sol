pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "../../node_modules/solidity-rlp/contracts/RLPReader.sol";
import "../../node_modules/openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";

contract Schemas is WhitelistedRole {

  using RLPReader for bytes;
  using RLPReader for uint;
  using RLPReader for RLPReader.RLPItem;

  struct Schema {   
    uint expirationDate;
    uint256 schemaId;
    uint256 amount;
    uint256 assetLifeTime;
    ClearingHouseRule[] clearingHouseRules;
    bool valid;
  }

  struct ClearingHouseRule {  
    uint percent; 
    address receptor;
    string description;
  }

  mapping (uint256 => Schema) private schemas_;
  uint256[] private schemasArray_ ;

  function getSchema(uint256 _schemaId) public view returns (Schema memory) {
    require(schemas_[_schemaId].schemaId > 0, "not_exist");
    return (schemas_[_schemaId]);
  }

  function getSchemas() public view returns (uint256[] memory) {    
    return (schemasArray_);
  }

  function createSchema(uint256 _schemaId, bytes memory _data) public onlyWhitelisted  {
    _createSchema(_schemaId, _data);  
  }

  function invalidateSchema(uint256 _schemaId) public  onlyWhitelisted {
    _schemaStatus(_schemaId, false);  
  }

  function validateSchema(uint256 _schemaId) public onlyWhitelisted  {
    _schemaStatus(_schemaId, true);  
  }

  function _createSchema(uint256 _schemaId, bytes memory _in) internal  {
    // RLP format : [<expirationDate>,<schemaId>,<amount>,<assetLifeTime>,[ [<percent>,<address>,<description>],[<percent>,<address>,<description>]]]

    require(schemas_[_schemaId].schemaId == 0, "exist"); 
   
    RLPReader.RLPItem memory item = _in.toRlpItem();
    RLPReader.RLPItem[] memory itemList = item.toList();

    uint expirationDate = itemList[0].toUint();

    require(expirationDate > now, "expired");

    uint256 schemaId = uint256(itemList[1].toUint());
    uint256 amount = uint256(itemList[2].toUint());
    uint256 assetLifeTime = uint256(itemList[3].toUint());

    
    RLPReader.RLPItem[] memory clearingHouseRulesItemList = itemList[4].toList();
    
    uint listLength = clearingHouseRulesItemList.length;
    for (uint i = 0; i < listLength; i++) {
      RLPReader.RLPItem[] memory tempListItem = clearingHouseRulesItemList[i].toList();
        
      schemas_[schemaId].clearingHouseRules.push(
        ClearingHouseRule(tempListItem[0].toUint(),tempListItem[1].toAddress(),string(tempListItem[2].toBytes()))
      );    
    }
    
    _validateClearingHouseRules(schemas_[schemaId].clearingHouseRules);
    
    schemas_[schemaId].expirationDate = expirationDate;
    schemas_[schemaId].schemaId = schemaId;
    schemas_[schemaId].amount = amount;
    schemas_[schemaId].assetLifeTime = assetLifeTime;
    schemas_[schemaId].valid = true;
    schemasArray_.push(schemaId);
  }

  function _schemaStatus(uint256 _schemaId, bool _newStatus) internal  {
    require(schemas_[_schemaId].schemaId != 0, "not exist"); 
    require(schemas_[_schemaId].valid != _newStatus , "same status");
    schemas_[_schemaId].valid = _newStatus;
  }

  function _validateClearingHouseRules(ClearingHouseRule[] storage clearingHouseRules) internal  {
    require(clearingHouseRules.length > 0, "not rules"); 
    uint listLength = clearingHouseRules.length;
    uint total = 0;
    for (uint i = 0; i < listLength; i++) {
      total += clearingHouseRules[i].percent;
    }
    require(total == 100, "all amount distributed");    
  }

}