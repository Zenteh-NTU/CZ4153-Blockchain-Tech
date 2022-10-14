// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0; //use 0.8.0
contract MarketTracker {

    Market[] public marketContracts;
    uint public contractsCount; 


    function addNewMarket(string memory _marketName, string[2] memory _side) public payable returns (string memory){
        Market newMarket = new Market(_marketName, address(this), _side);
        marketContracts.push(newMarket);
        contractsCount++;
        //console.log("Market Created: ", _marketName);
        return string(abi.encodePacked("Market Created: ", _marketName, "| Sides:", _side[0], _side[1]));
    }
    //function getMarketContracts() public view returns (address[] memory){
    //    return marketContracts;
    //}
    function getNameBasedOffIndex(uint marketIndex) external view  returns (string memory){
        return marketContracts[marketIndex].getMarketName();
    }
}

contract Market {
    string public MarketName;
    string[2] public Side; 
    mapping(uint => uint) public bets;
    mapping(address => mapping(uint => uint)) public betsPerGambler;
    address public Owner;
    
    
    constructor(string memory _marketName, address _owner, string[2] memory _side){
        MarketName = _marketName;
        Side = _side;
        Owner = _owner;
        bets[0] = 0;
        bets[1] = 0;
    }
    function getMarketName() public view returns (string memory) {
        return MarketName;
    }
    function placeBet(uint sideIndex) external payable{
        bets[sideIndex] += 1;
        betsPerGambler[msg.sender][sideIndex] = msg.value;

    }

    function getSide0Count() public view returns (uint){
        return bets[0];
    }
    function getSide1Count() public view returns (uint){
        return bets[1];
    }

    function getSide0Bet() public view returns (uint){
        return betsPerGambler[msg.sender][0];
    }

    function getSide1Bet() public view returns (uint){
        return betsPerGambler[msg.sender][1];
    }


    // function getOwnerBetAmount() public view returns (uint[2] memory){
    //     uint[2] memory sideAmt;
    //     sideAmt[0] = betsPerGambler[msg.sender][0];
    //     sideAmt[1] = betsPerGambler[msg.sender][1];
    //     return sideAmt;
    // }

} 