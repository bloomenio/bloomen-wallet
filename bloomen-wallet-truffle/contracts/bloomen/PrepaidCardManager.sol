pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../../node_modules/openzeppelin-solidity/contracts/access/roles/SignerRole.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./Devices.sol";

contract PrepaidCardManager is SignerRole, Ownable , Devices {
  using SafeMath for uint256;

  event CardValidated(
    address indexed owner,
    uint256 cardId,
    address indexed user
  );

  struct Card {
    bytes32 hash;
    uint256 cardId;  
    uint256 tokens;
    bool active;
    address owner;
    uint initialized;
  }

  mapping (uint256 => Card) private cards_;
  mapping (bytes32 => uint256) private cardsByHash_;

  modifier cardExists(uint256 _cardId) {
    require(cards_[_cardId].initialized > 0, "not_exist");
    _;
  }
  
  constructor() public {}

  function getCard(uint256 _cardId) cardExists(_cardId) public view returns(uint256 cardId, address owner, uint256 tokens, bool active)  {
    return (cards_[_cardId].cardId, cards_[_cardId].owner, cards_[_cardId].tokens, cards_[_cardId].active);
  }

  function addCard(uint256 _cardId, uint256 _tokens, bytes32 _hash) onlyOwner public {
    require(_tokens > 0, "empty_tokens");
    require(_cardId > 0, "no_valid_card_id");
    require(cards_[_cardId].initialized == 0, "card_exist");
    require(cardsByHash_[_hash] == 0, "duplicated_hash");

    _mint(this,_tokens);
    Card memory newCard = Card(_hash, _cardId, _tokens, false, msg.sender, 1);
    cards_[_cardId] = newCard;   
    cardsByHash_[_hash] = _cardId;
  }

  function activateCard(uint256 _cardId) cardExists(_cardId) onlySigner public {
    require(cards_[_cardId].active == false, "not_activatable");
    cards_[_cardId].active=true;    
  }

  function validateCard(bytes _secret) public {
    bytes32 hash = keccak256(_secret);
    uint256 cardId = cardsByHash_[hash];
    require(cardId > 0, "hash_not_found");
    require(cards_[cardId].active == true, "not_active");
    require(cards_[cardId].hash ==  hash, "wrong_secret");
  
    _transfer(this, msg.sender,cards_[cardId].tokens);
    emit CardValidated(cards_[cardId].owner, cards_[cardId].cardId, msg.sender);
  
    delete cardsByHash_[hash];
    delete cards_[cardId];
  }

}