// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0; //use 0.8.0
//import "contracts/Market.sol";


//keeps track of markets and transactions
contract MarketTracker {

    Market[] public marketContracts;
    uint public marketContractsCount; 

    Transactions[] public transactionsContracts;
    uint public transactionsContractsCount; 


    //simple test functions to test if contract file is working=========

    string public testVariable = "Hello World";
    function testFunction() public view returns (string memory){
        return testVariable;
    }

    //================================

    function addNewMarket(string memory _marketName, string[2] memory _side, uint _resultDate) public payable returns (string memory){
        require(msg.value == 1 ether, "You need to pass in exactly 1 ether");
        Market newMarket = new Market(_marketName, address(this), msg.sender ,_side, _resultDate);
        marketContracts.push(newMarket);
        marketContractsCount++;

        Transactions newTransaction = new Transactions("Market Creation", msg.value, msg.sender, address(this), "", 0);
        transactionsContracts.push(newTransaction);
        transactionsContractsCount++;

        //console.log("Market Created: ", _marketName);
        return string(abi.encodePacked("Market Created: ", _marketName, "| Sides:", _side[0], _side[1]));
    }


    function getMarketArray() public view returns (Market[] memory){
        return marketContracts;
    }

    function getTransactionsArray() public view returns (Transactions[] memory){
        return transactionsContracts;
    }

    function pushToTransactionsArray(Transactions _transaction) public returns (Transactions[] memory){
        transactionsContracts.push(_transaction);
        return transactionsContracts;
    }

    function getNameBasedOffIndex(uint marketIndex) external view  returns (string memory){
        return marketContracts[marketIndex].getMarketName();
    }
}

//transactions
contract Transactions {
    string public transaction_type; //'contract creation' 'buy' 'sell' 'reward claim'
    uint ethereum_value; //in ethers
    address owner_hash; //owner hash account
    address recipient_hash; //recipient hash account
    string public token_type; //token type if transaction_type is 'buy' or 'sell' | 'Y-Token' or "N-Token'
    uint token_count; // Token bought, leave as 0 if no tokens are bought


    constructor(string memory _transaction_type, uint _ethereum_value, address _owner_hash, address _recipient_hash, string memory _token_type, uint _token_count){
        transaction_type = _transaction_type; //'Market Creation' 'buy' 'sell' 'reward claim'
        ethereum_value = _ethereum_value; //in ethers
        owner_hash = _owner_hash; //owner hash account
        recipient_hash = _recipient_hash; //recipient hash account
        token_type = _token_type; //token type if transaction_type is 'buy' or 'sell' | 'Y-Token' or "N-Token'
        token_count = _token_count; // Token bought, leave as 0 if no tokens are bought
    }

}


//markets
contract Market {
    string public marketName;
    string[2] public Side; 
//    mapping(uint => uint) public bets;
    mapping(address => mapping(uint => uint)) public tokensPerGambler; //1 = Y-Token, 0 = N-Token
    address public factoryAddress; //MarketTracker address
    address public owner; 
    uint public Y_Tokens;
    uint public N_Tokens;
    uint public resultDate;
    
    uint public currentYPrice;
    uint public currentNPrice;
    uint public maxPrice = 1e18;

    constructor(string memory _marketName, address _factoryAddress, address _owner, string[2] memory _side, uint _resultDate){
        marketName = _marketName;
        Side = _side;
        factoryAddress = _factoryAddress;
        owner = _owner;
        Y_Tokens = 0;
        N_Tokens = 0;
        resultDate = _resultDate;
        currentYPrice = maxPrice / (Y_Tokens + N_Tokens + 2) * (Y_Tokens + 1);
        currentNPrice = maxPrice / (Y_Tokens + N_Tokens + 2) * (N_Tokens + 1);
    }

    function buyYToken(uint amount) public payable{

    }


    function getMarketName() public view returns (string memory) {
        return marketName;
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

    function getYPrice() public view returns (uint){
        return currentYPrice;
    }

    function getNPrice() public view returns (uint){
        return currentYPrice;
    }

    function getResultDate() public view returns (uint){
        return resultDate;
    }

    function getFactoryAddress() public view returns (address) {
        return factoryAddress;
    }

    function getOwnerAddress() public view returns (address) {
        return owner;
    }





    // function getOwnerBetAmount() public view returns (uint[2] memory){
    //     uint[2] memory sideAmt;
    //     sideAmt[0] = betsPerGambler[msg.sender][0];
    //     sideAmt[1] = betsPerGambler[msg.sender][1];
    //     return sideAmt;
    // }

} 