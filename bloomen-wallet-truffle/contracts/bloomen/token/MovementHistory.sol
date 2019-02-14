pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

contract MovementHistory {

    struct Movement {
        int256 amount;
        string description;
        uint date;
        address to;
    }

    mapping (address => Movement[]) private transfersMap_;
    mapping (address => int256) private currentIndexMap_;
    int256 constant private MAX = 100;
    int256 constant private PAGE_SIZE = 10;
    int256 constant private MAX_PAGE_NUMBER = MAX/PAGE_SIZE;

    function addMovement(int256 _amount, string memory _description,  address _to) public {
        _addMovement(_amount, _description, msg.sender, _to);
    }
    
    function _addMovement(int256 _amount, string memory _description,  address _from, address _to) internal {
        if (transfersMap_[_from].length < uint256(MAX)) {
            transfersMap_[_from].push(Movement(_amount, _description, now, _to));
            currentIndexMap_[_from] = int256(transfersMap_[_from].length - 1);
        } else if (currentIndexMap_[_from] == MAX - 1) {
            currentIndexMap_[_from] = 0;
            transfersMap_[_from][0] = Movement(_amount, _description, now, _to);
        } else {
            currentIndexMap_[_from]++;
            transfersMap_[_from][uint256(currentIndexMap_[_from])] = Movement(_amount, _description, now, _to);
        }
    }


    function getMovements( int256 _page) public view returns (Movement[] memory) {
        require(_page > 0 && _page <= MAX_PAGE_NUMBER, "Invalid page.");

        uint256 _reqIndexOffset = uint256(PAGE_SIZE * (_page - 1));
        Movement[] memory transfers = transfersMap_[msg.sender];
        if (transfers.length <= _reqIndexOffset) {
            return;
        }


         Movement[] memory _transfersPage = new Movement[](uint256(PAGE_SIZE));

        for (int256 i = 0; i < int(PAGE_SIZE); i++) {
            int256 _transferIndex = currentIndexMap_[msg.sender] - int256(_reqIndexOffset) - i;
            if (_transferIndex < 0) {
                if (transfers.length < uint256(MAX) ) {
                    return _transfersPage;
                } else {
                    _transferIndex += MAX;
                }
            }
            _transfersPage[uint256(i)]= transfers[uint256(_transferIndex)];
        }
      
        return _transfersPage;
    }
}