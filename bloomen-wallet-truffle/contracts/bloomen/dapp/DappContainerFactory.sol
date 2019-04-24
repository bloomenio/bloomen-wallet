pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "./DappContainer.sol";
import "../../../node_modules/solidity-rlp/contracts/RLPReader.sol";
import "../../../node_modules/openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";

contract DappContainerFactory is WhitelistedRole {

  using RLPReader for bytes;
  using RLPReader for uint;
  using RLPReader for RLPReader.RLPItem;

  struct Container {
    address addr;
    string name;
  }

  Container[] private containers_;

  function createContainer(bytes memory _in, string memory _name) onlyWhitelisted public {
    RLPReader.RLPItem memory item = _in.toRlpItem();
    RLPReader.RLPItem[] memory itemList = item.toList();

    uint listLength = itemList.length;
    DappContainer.PathValue[] memory data = new DappContainer.PathValue[](listLength);
    for (uint i = 0; i < listLength; i++) {
      DappContainer.PathValue memory pathValue = DappContainer.PathValue(
        string(itemList[i].toList()[0].toBytes()),
        string(itemList[i].toList()[1].toBytes()),
        string(itemList[i].toList()[2].toBytes())
      );
      data[i] = pathValue;
    } 

    DappContainer container = new DappContainer();    
    container.addWhitelisted(msg.sender);
    container.addWhitelisted(address(this));
    container.initialize(data);

    containers_.push(Container(address(container), _name)); 
  }

  function getContainers() public view returns (Container[] memory) {
    return containers_;
  }

}