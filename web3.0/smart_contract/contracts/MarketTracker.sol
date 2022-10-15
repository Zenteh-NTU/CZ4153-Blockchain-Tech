// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0; //use 0.8.0
//import "contracts/Market.sol";

//keeps track of markets and transactions
contract MarketTracker {

    Market[] public marketContracts;
    uint public contractsCount; 


    //simple test functions to test if contract file is working=========

    TestContract[] public testContracts;
    uint public testContractsCount; 
    string public testVariable = "Hello World";
    function testFunction() public view returns (string memory){
        return testVariable;
    }
    function testFunction_2() public payable returns (string memory){
        require(msg.value == 1 ether, "You need to pass in exactly 1 ether");
        TestContract newTestContract = new TestContract();
        testContracts.push(newTestContract);
        return "Test contract created";
    }
    function testFunction_3() public view returns (string memory){
        return testContracts[0].testFunction();
    }
    function getTestArray() public view returns (TestContract[] memory){
        return testContracts;
    }
    function getFirstTestArray() public view returns (string memory){
        return testContracts[0].testFunction();
    }

    //================================



    function addNewMarket(string memory _marketName, string[2] memory _side, uint _resultDate) public payable returns (string memory){
        require(msg.value == 1 ether, "You need to pass in exactly 1 ether");
        Market newMarket = new Market(_marketName, address(this), _side, _resultDate);
        marketContracts.push(newMarket);
        contractsCount++;
        //console.log("Market Created: ", _marketName);
        return string(abi.encodePacked("Market Created: ", _marketName, "| Sides:", _side[0], _side[1]));
    }


    function getMarketArray() public view returns (Market[] memory){
        return marketContracts;
    }

    //function getMarketContracts() public view returns (address[] memory){
    //    return marketContracts;
    //}
    function getNameBasedOffIndex(uint marketIndex) external view  returns (string memory){
        return marketContracts[marketIndex].getMarketName();
    }
}

//transactions
contract Transactions {
    string public tx_hash;
    string public transaction_type;
    uint ethereum_value;
    address owner_hash;

    constructor(string memory _tx_hash, string memory _transaction_type, uint _ethereum_value, address _owner_hash){

    }

}

//test contract

contract TestContract {
//simple test functions to test if contract file is working=========
    constructor() {

    }
    string public testVariable = "Hello from the other side!";
    function testFunction() public view returns (string memory){
        return testVariable;
    }

    //================================


}

//markets
contract Market {
    string public MarketName;
    string[2] public Side; 
//    mapping(uint => uint) public bets;
//    mapping(address => mapping(uint => uint)) public betsPerGambler;
    address public Owner;
    uint Y_Tokens;
    uint N_Tokens;
    uint resultDate;
    
    
    constructor(string memory _marketName, address _owner, string[2] memory _side, uint _resultDate){
        MarketName = _marketName;
        Side = _side;
        Owner = _owner;
        Y_Tokens = 0;
        N_Tokens = 0;
        resultDate = _resultDate;
    }


    function getMarketName() public view returns (string memory) {
        return MarketName;
    }

    function getSide() public view returns (string[2] memory) {
        return Side;
    }

    function getYTokens() public view returns (uint){
        return Y_Tokens;
    }

    function getNTokens() public view returns (uint){
        return N_Tokens;
    }

    function getResultDate() public view returns (uint){
        return resultDate;
    }



    // function getOwnerBetAmount() public view returns (uint[2] memory){
    //     uint[2] memory sideAmt;
    //     sideAmt[0] = betsPerGambler[msg.sender][0];
    //     sideAmt[1] = betsPerGambler[msg.sender][1];
    //     return sideAmt;
    // }

} 