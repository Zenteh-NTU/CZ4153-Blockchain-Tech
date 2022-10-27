// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0; //use 0.8.0

//import "contracts/Market.sol";

//keeps track of markets and transactions
contract MarketTracker {
    Market[] public marketContracts;
    uint256 public marketContractsCount;

    Transactions[] public transactionsContracts;
    uint256 public transactionsContractsCount;

    //simple test functions to test if contract file is working=========

    string public testVariable = "Hello World";

    function testFunction() public view returns (string memory) {
        return testVariable;
    }

    //================================

    function addNewMarket(
        string memory _marketName,
        string[2] memory _side,
        uint256 _resultDate
    ) public payable returns (string memory) {
        require(msg.value == 1 ether, "You need to pass in exactly 1 ether");
        Market newMarket = new Market(
            _marketName,
            address(this),
            msg.sender,
            _side,
            _resultDate
        );
        marketContracts.push(newMarket);
        marketContractsCount++;

        Transactions newTransaction = new Transactions(
            "Market Creation",
            msg.value,
            msg.sender,
            address(this),
            "",
            0
        );
        transactionsContracts.push(newTransaction);
        transactionsContractsCount++;

        //console.log("Market Created: ", _marketName);
        return
            string(
                abi.encodePacked(
                    "Market Created: ",
                    _marketName,
                    "| Sides:",
                    _side[0],
                    _side[1]
                )
            );
    }

    function getMarketArray() public view returns (Market[] memory) {
        return marketContracts;
    }

    function getTransactionsArray()
        public
        view
        returns (Transactions[] memory)
    {
        return transactionsContracts;
    }

    function pushToTransactionsArray(Transactions _transaction)
        public
        returns (Transactions[] memory)
    {
        transactionsContracts.push(_transaction);
        transactionsContractsCount += 1;
        return transactionsContracts;
    }

    function getNameBasedOffIndex(uint256 marketIndex)
        external
        view
        returns (string memory)
    {
        return marketContracts[marketIndex].getMarketName();
    }
}

//transactions
contract Transactions {
    string public transaction_type; //'contract creation' 'buy' 'sell' 'reward claim'
    uint256 ethereum_value; //in ethers
    address owner_hash; //owner hash account
    address recipient_hash; //recipient hash account
    string public token_type; //token type if transaction_type is 'buy' or 'sell' | 'Y-Token' or "N-Token'
    uint256 token_count; // Token bought, leave as 0 if no tokens are bought

    constructor(
        string memory _transaction_type,
        uint256 _ethereum_value,
        address _owner_hash,
        address _recipient_hash,
        string memory _token_type,
        uint256 _token_count
    ) {
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
    mapping(address => mapping(uint256 => uint256)) public tokensPerGambler; //1 = Y-Token, 0 = N-Token
    address public factoryAddress; //MarketTracker address
    address public owner;
    uint256 public Y_Tokens;
    uint256 public N_Tokens;
    uint256 public resultDate;

    uint256 public currentYPrice;
    uint256 public currentNPrice;
    uint256 public maxPrice = 1e18;

    event Transaction(address buyer, address seller, uint256 amount);
    MarketTracker marketTracker;

    constructor(
        string memory _marketName,
        address _factoryAddress,
        address _owner,
        string[2] memory _side,
        uint256 _resultDate
    ) {
        marketName = _marketName;
        Side = _side;
        factoryAddress = _factoryAddress;
        owner = _owner;
        Y_Tokens = 0;
        N_Tokens = 0;
        resultDate = _resultDate;
        currentYPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (Y_Tokens + 1);
        currentNPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (N_Tokens + 1);
    }

    function addTransactions(
        address buyer,
        address seller,
        uint256 amount,
        Transactions transaction
    ) public {
        marketTracker.pushToTransactionsArray(transaction);
        emit Transaction(buyer, seller, amount);
    }

    function buyYToken(uint256 amountOfCoin) public payable {
        uint256 amount = amountOfCoin * currentYPrice;
        require(msg.value == amount, "You need to pass in the correct amount of ether");
        Transactions newTransaction = new Transactions(
            "Buy",
            amount,
            msg.sender,
            address(this),
            "",
            amountOfCoin
        );
        Y_Tokens += amountOfCoin;
        tokensPerGambler[msg.sender][1] += amountOfCoin;
        MarketTracker(factoryAddress).pushToTransactionsArray(newTransaction);
        currentYPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (Y_Tokens + 1);
        currentNPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (N_Tokens + 1);
        //addTransactions(msg.sender, address(this), amount, newTransaction);
    }

    function buyNToken(uint256 amountOfCoin) public payable {
        uint256 amount = amountOfCoin * currentNPrice;
        Transactions newTransaction = new Transactions(
            "Buy",
            amount,
            msg.sender,
            address(this),
            "",
            amountOfCoin
        );
        N_Tokens += amountOfCoin;
        tokensPerGambler[msg.sender][0] += amountOfCoin;
        MarketTracker(factoryAddress).pushToTransactionsArray(newTransaction);
        currentYPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (Y_Tokens + 1);
        currentNPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (N_Tokens + 1);
        //addTransactions(msg.sender, address(this), amount, newTransaction);
    }

    function sellYToken(uint256 amountOfCoin) public payable {
        require(
            tokensPerGambler[msg.sender][1] >= amountOfCoin,
            "Not Enough Tokens!"
        );
        uint256 amount = amountOfCoin * currentYPrice;
        Transactions newTransaction = new Transactions(
            "Sell",
            amount,
            address(this),
            msg.sender,
            "",
            amountOfCoin
        );
        Y_Tokens -= amountOfCoin;
        tokensPerGambler[msg.sender][1] -= amountOfCoin;
        MarketTracker(factoryAddress).pushToTransactionsArray(newTransaction);
        currentYPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (Y_Tokens + 1);
        currentNPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (N_Tokens + 1);
        //addTransactions(address(this), msg.sender, amount, newTransaction);
    }

    function sellNToken(uint256 amountOfCoin) public payable {
        require(
            tokensPerGambler[msg.sender][0] >= amountOfCoin,
            "Not Enough Tokens!"
        );
        uint256 amount = amountOfCoin * currentNPrice;
        Transactions newTransaction = new Transactions(
            "Sell",
            amount,
            address(this),
            msg.sender,
            "",
            amountOfCoin
        );
        N_Tokens -= amountOfCoin;
        tokensPerGambler[msg.sender][0] -= amountOfCoin;
        MarketTracker(factoryAddress).pushToTransactionsArray(newTransaction);
        currentYPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (Y_Tokens + 1);
        currentNPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (N_Tokens + 1);
        //addTransactions(address(this), msg.sender, amount, newTransaction);
    }

    function getMarketName() public view returns (string memory) {
        return marketName;
    }

    function getSide() public view returns (string[2] memory) {
        return Side;
    }

    function getYTokens() public view returns (uint256) {
        return Y_Tokens;
    }

    function getNTokens() public view returns (uint256) {
        return N_Tokens;
    }

    function getYPrice() public view returns (uint256) {
        return currentYPrice;
    }

    function getNPrice() public view returns (uint256) {
        return currentNPrice;
    }

    function getResultDate() public view returns (uint256) {
        return resultDate;
    }

    function getFactoryAddress() public view returns (address) {
        return factoryAddress;
    }

    function getOwnerAddress() public view returns (address) {
        return owner;
    }

    function getUserYTokens() public view returns (uint256) {
        return tokensPerGambler[msg.sender][1];
    }

    function getUserNTokens() public view returns (uint256) {
        return tokensPerGambler[msg.sender][0];
    }

    // function getOwnerBetAmount() public view returns (uint[2] memory){
    //     uint[2] memory sideAmt;
    //     sideAmt[0] = betsPerGambler[msg.sender][0];
    //     sideAmt[1] = betsPerGambler[msg.sender][1];
    //     return sideAmt;
    // }
}
