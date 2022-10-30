// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0; //use 0.8.0

//import "contracts/Market.sol";

//keeps track of markets and transactions
contract MarketTracker {
    address public staffAddress;

    Market[] public marketContracts;
    uint256 public marketContractsCount;

    Transactions[] public transactionsContracts;
    uint256 public transactionsContractsCount;

    constructor() {
        staffAddress = address(msg.sender);
    }

    //simple test functions to test if contract file is working=========

    string public testVariable = "Hello World";

    function testFunction() public view returns (string memory) {
        return testVariable;
    }

    //================================

    function getStaffAddress() public view returns (address) {
        return staffAddress;
    }

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
        address payable marketAddress = payable(address(newMarket));
        (bool success, bytes memory _data) = marketAddress.call{value: 1 ether}(
            abi.encodeWithSignature("receiveEther()")
        );
        require(success, "Call failed");
        marketContracts.push(newMarket);
        marketContractsCount++;

        Transactions newTransaction = new Transactions(
            "Contract Creation",
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

    function checkPermission() public view returns (bool) {
        address ownerAddress = staffAddress;
        require(
            msg.sender == ownerAddress,
            "You do not have oracle permission"
        );
        return true;
    }
}

//transactions
contract Transactions {
    string public transaction_type; //'contract creation' 'buy' 'sell' 'reward claim'
    uint256 ethereum_value; //in wei
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
    function getTransactionType() public view returns (string memory) {
        return transaction_type;
    }
    function getEthereumValue() public view returns (uint) {
        return ethereum_value;
    }
    function getOwnerHash() public view returns (address) {
        return owner_hash;
    }
    function getRecipientHash() public view returns (address) {
        return recipient_hash;
    }
    function getTokenType() public view returns (string memory) {
        return token_type;
    }
    function getTokenCount() public view returns (uint) {
        return token_count;
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
    uint8 public winner;
    uint8 public loser;
    bool public oracleDecided;
    uint256 public winningsPerToken;

    event Transaction(address buyer, address seller, uint256 amount);

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
        oracleDecided = false;
    }

    function getWebsiteStaff() public view returns (address) {
        return MarketTracker(factoryAddress).getStaffAddress();
    }

    function checkPermission() public view returns (bool) {
        address ownerAddress = getWebsiteStaff();
        require(msg.sender == ownerAddress, "You do not have permission");
        return true;
    }

    function getOracleDecision() public view returns (bool) {
        return oracleDecided;
    }
    function receiveEther() external payable {}


    function buyYToken(uint256 amountOfCoin) public payable {
        require(oracleDecided == false, "Oracle has decided already");
        uint256 amount = amountOfCoin * currentYPrice;
        require(
            msg.value == amount,
            "You need to pass in the correct amount of ether"
        );
        Transactions newTransaction = new Transactions(
            "Buy",
            amount,
            msg.sender,
            address(this),
            "Y-Token",
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
        require(oracleDecided == false, "Oracle has decided already");
        uint256 amount = amountOfCoin * currentNPrice;
        require(
            msg.value == amount,
            "You need to pass in the correct amount of ether"
        );
        Transactions newTransaction = new Transactions(
            "Buy",
            amount,
            msg.sender,
            address(this),
            "N-Token",
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
        require(oracleDecided == false, "Oracle has decided already");
        require(
            tokensPerGambler[msg.sender][1] >= amountOfCoin,
            "Not Enough Tokens!"
        );
        uint256 amount = amountOfCoin * currentYPrice;
        Transactions newTransaction = new Transactions(
            "Sell",
            amount,
            msg.sender,
            address(this),
            "Y-Token",
            amountOfCoin
        );
        payable(msg.sender).transfer(amount);
        Y_Tokens -= amountOfCoin;
        tokensPerGambler[msg.sender][1] -= amountOfCoin;
        MarketTracker(factoryAddress).pushToTransactionsArray(newTransaction);
        currentYPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (Y_Tokens + 1);
        currentNPrice = (maxPrice / (Y_Tokens + N_Tokens + 2)) * (N_Tokens + 1);
        //addTransactions(address(this), msg.sender, amount, newTransaction);
    }

    function sellNToken(uint256 amountOfCoin) public payable {
        require(oracleDecided == false, "Oracle has decided already");
        require(
            tokensPerGambler[msg.sender][0] >= amountOfCoin,
            "Not Enough Tokens!"
        );
        uint256 amount = amountOfCoin * currentNPrice;
        Transactions newTransaction = new Transactions(
            "Sell",
            amount,
            msg.sender,
            address(this),
            "N-Token",
            amountOfCoin
        );
        payable(msg.sender).transfer(amount);
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

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawGains() public payable {
        uint256 gamblerBet = tokensPerGambler[msg.sender][winner];
        uint256 reward = 0;
        require(gamblerBet > 0, "You do not have any winning bet");
        require(oracleDecided == true, "Oracle has not decided on outcome");
        if (winner == 0) {
            reward = address(this).balance / N_Tokens * tokensPerGambler[msg.sender][0];
            N_Tokens -= tokensPerGambler[msg.sender][0];
            payable(msg.sender).transfer(reward);
        } else if (winner == 1) {
            reward = address(this).balance / Y_Tokens * tokensPerGambler[msg.sender][1];
            Y_Tokens -= tokensPerGambler[msg.sender][1];
            payable(msg.sender).transfer(reward);
        }
        Transactions newTransaction = new Transactions(
            "Reward Claim",
            reward,
            msg.sender,
            address(this),
            "",
            0
        );
        MarketTracker(factoryAddress).pushToTransactionsArray(newTransaction);
        tokensPerGambler[msg.sender][0] = 0;
        tokensPerGambler[msg.sender][1] = 0;
    }

    function setWinningBet(uint8 _winner, uint8 _loser) public {
        address ownerAddress = getWebsiteStaff();
        require(msg.sender == ownerAddress && oracleDecided == false , "You do not have permission/You have already chosen");
        winner = _winner;
        loser = _loser;
        oracleDecided = true;
        // if (winner == 1) {
        //     winningsPerToken = (address(this).balance / Y_Tokens);
        // } else if (winner == 0) {
        //     winningsPerToken = (address(this).balance / N_Tokens);
        // }
    }

    function getWinner() public view returns (uint8) {
        return winner;
    }

    // function getWinningsPerToken() public view returns (uint256) {
    //     return winningsPerToken;
    // }
}
