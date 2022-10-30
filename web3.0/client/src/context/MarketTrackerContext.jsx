import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { marketTrackerContractABI, marketContractABI, transactionsABI, contractAddress } from '../utils/constants';
import { isAddress, parseBytes32String } from 'ethers/lib/utils';

export const MarketTrackerContext = React.createContext();
const { ethereum } = window;

export const getEthereumContract = (smartContractAddress, ABI) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const marketTrackerContract = new ethers.Contract(smartContractAddress, ABI, signer);

    // console.log({
    //     provider,
    //     signer,
    //     marketTrackerContract
    // });
    return marketTrackerContract;
}


export const MarketTrackerProvider = ({ children }) => {
    try{
        new ethers.providers.Web3Provider(ethereum);
    }catch(error){
        alert("Please install metamask and refresh the page before continuing!");
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const [currentAccount, setCurrentAccount] = useState('');
    const [isStaff, setIsStaff] = useState(false);
    const [currentBalance, setCurrentBalance] = useState('');
    const [listOfMarkets, setListOfMarkets] = useState([]);
    const [currentMarket, setCurrentMarket] = useState({});
    const [formData, setFormData] = useState({marketTitle: '', YTokenName: '', NTokenName:'', resultDay: ''});
    const [winning, setWinning] = useState(currentMarket.WinningBet);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {

        try{
            if(!ethereum) return alert("Please install metamask!");
            const accounts = await ethereum.request({
                method: 'eth_accounts'
            });
            if(accounts.length){
                setCurrentAccount(accounts[0]);
    
                //getAllTransactions();
            }else{
                console.log('No accounts found');
            }
            console.log(accounts[0]);
            const balance = await provider.getBalance(accounts[0]);
            const balanceEth = ethers.utils.formatEther(balance);
            setCurrentBalance(balanceEth);
        }catch (error){
            console.log(error);
            throw new Error("No ethereum object.");
        }

    }

    const createNewMarket = async () => {
        try{
            if(!ethereum) return alert("Please install metamask!");
            //get data from form...
            const { marketTitle, YTokenName, NTokenName, resultDay } = formData;
            //get contract
            const marketTrackerContract = getEthereumContract(contractAddress, marketTrackerContractABI);
            console.log(marketTrackerContract);
            //testing if contract works
            const transactionHash = await marketTrackerContract.testFunction();
            console.log(transactionHash); //should return hello world
            const createMarketTransactionHash = await marketTrackerContract.addNewMarket(marketTitle, [NTokenName, YTokenName], (Math.floor(new Date(resultDay).getTime() / 1000)), { value: ethers.utils.parseEther("1") });
            alert("Transaction successful!");
            window.location.reload();
            console.log(createMarketTransactionHash); //convert to unix time


        }catch (error){
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    const tradeTokens = async (string, contract, howMany) => {
        const market = getEthereumContract(contract, marketContractABI);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const oracleAddress = market.getOwnerAddress();
        const Y_amount =  currentMarket.Y_Price_wei.mul(howMany);
        const N_amount =  currentMarket.N_Price_wei.mul(howMany);
        if (string === "buyY") {
            const balance = (parseFloat(currentBalance) - (currentMarket.Y_Price*howMany)).toString();
            const tokenHash = await market.buyYToken(howMany, { value: Y_amount });
            const receipt = await tokenHash.wait();
            console.log("receipt:",receipt);
            if (receipt) alert("Transaction Complete!");
            setCurrentBalance(balance);
            //const transaction = await signer.sendTransaction({from: signer.getAddress(), to: oracleAddress, value: ethers.utils.parseEther(amount.toString())})
            //const createMarketTransactionHash = await market.addNewMarket.buyYToken()(marketTitle, [NTokenName, YTokenName], (Math.floor(new Date(resultDay).getTime() / 1000)), { value: ethers.utils.parseEther("1") });
        } else if (string === "sellY") {
            if(howMany <= currentMarket.UserYToken){
                const balance = (parseFloat(currentBalance) + (currentMarket.Y_Price*howMany)).toString();
                const tokenHash = await market.sellYToken(howMany);
                const receipt = await tokenHash.wait();
                console.log("receipt:",receipt);
                if (receipt) alert("Transaction Complete!");
                setCurrentBalance(balance);
            }else{
                alert("You cannot sell more than the amount of tokens you own");
            }
            //const transaction = await signer.sendTransaction({from: oracleAddress, to: signer.getAddress(), value: ethers.utils.parseEther(amount.toString())})
        } else if (string === "buyN") {
            const balance = (parseFloat(currentBalance) - (currentMarket.N_Price*howMany)).toString();
            const tokenHash = await market.buyNToken(howMany, { value: N_amount});
            const receipt = await tokenHash.wait();
            console.log("receipt:",receipt);
            if (receipt) alert("Transaction Complete!");
            setCurrentBalance(balance);
            //const transaction = await signer.sendTransaction({from: signer.getAddress(), to: oracleAddress, value: ethers.utils.parseEther(amount.toString())})
        } else {
            //market.sellNToken(howMany);
            //const transaction = await signer.sendTransaction({from: oracleAddress, to: signer.getAddress(), value: ethers.utils.parseEther(amount.toString())})
            if(howMany <= currentMarket.UserNToken){
                const balance = (parseFloat(currentBalance) + (currentMarket.N_Price*howMany)).toString();
                const tokenHash = await market.sellNToken(howMany);
                const receipt = await tokenHash.wait();
                console.log("receipt:",receipt);
                if (receipt) alert("Transaction Complete!");
                setCurrentBalance(balance);
            }else{
                alert("You cannot sell more than the amount of tokens you own");
            }
        
        }
        console.log("market reloaded");
        console.log(currentMarket.contractHash);
        const newMarket = await setMarketVariables(currentMarket.contractHash);
        console.log(newMarket);
    }

    const setWinningBets = async (winner, loser, contract) => {
        const market = getEthereumContract(contract, marketContractABI);
        const tokenHash = await market.setWinningBet(winner, loser);
        // const winningBetStr = await market.getWinningBet();
        const receipt = await tokenHash.wait();
        console.log("receipt:",receipt);
        if (receipt) alert("Transaction Complete!");
        // setWinning(winningBetStr);
        if (winner == 1) {
            currentMarket.Y_Price = "1";
            currentMarket.N_Price = "0";
        } else if (winner == 0) {
            currentMarket.Y_Price = "0";
            currentMarket.N_Price = "1";
        }
    }

    const collectClaims = async (contract) => {
        const market = getEthereumContract(contract, marketContractABI);
        const tokenHash = await market.withdrawGains();
        const receipt = await tokenHash.wait();
        console.log("receipt:",receipt);
        const winner = await market.getWinner();
        const winningsPerTokenWei = await market.getWinningsPerToken();
        console.log(winningsPerTokenWei);
        const winningsPerToken = ethers.utils.formatEther(winningsPerTokenWei);
        if (receipt) alert("Transaction Complete!");
        console.log(winner);
        if (winner == 1) {
            const balance = (parseFloat(currentBalance) + (currentMarket.UserYToken * parseFloat(winningsPerToken))).toString();
            setCurrentBalance(balance);
            currentMarket.contractBalance = (parseFloat(currentMarket.contractBalance) - (currentMarket.UserYToken * parseFloat(winningsPerToken))).toString();
        } else if (winner == 0) {
            const balance = (parseFloat(currentBalance) + (currentMarket.UserNToken * parseFloat(winningsPerToken))).toString();
            setCurrentBalance(balance);
            currentMarket.contractBalance = (parseFloat(currentMarket.contractBalance) - (currentMarket.UserNToken * parseFloat(winningsPerToken))).toString();
        }
        currentMarket.UserYToken = 0;
        currentMarket.UserNToken = 0;
    } 


    const setMarketVariables = async (marketContractHash) => {
        const contractHash = marketContractHash;
        const marketContract = getEthereumContract(contractHash, marketContractABI);
        const ownerHash = await marketContract.getOwnerAddress();
        const marketName = await marketContract.getMarketName();

        const Y_Tokens = await marketContract.getYTokens();
        const N_Tokens = await marketContract.getNTokens();
        const getUserNToken = await marketContract.getUserNTokens();
        const getUserYToken = await marketContract.getUserYTokens();
        const Y_Price = await marketContract.getYPrice();
        const N_Price = await marketContract.getNPrice();
        const sides = await marketContract.getSide();
        const resultUNIXDate = await marketContract.getResultDate();
        const resultDate = new Date(resultUNIXDate.toString() * 1000);
        const contractBalance = await marketContract.getContractBalance();
        const winner = await marketContract.getWinner();
        const winningsPerToken = await marketContract.getWinningsPerToken();
        
        const marketObj = {
            contractHash:contractHash, 
            ownerHash: ownerHash,
            marketName: marketName,
            Y_Tokens: parseInt(Y_Tokens), //1
            N_Tokens: parseInt(N_Tokens), //0
            Y_Price_wei: Y_Price,
            N_Price_wei: N_Price,
            Y_Price: ethers.utils.formatEther(Y_Price), 
            N_Price: ethers.utils.formatEther(N_Price), 
            sides: sides, 
            resultDate: resultDate,
            UserYToken: parseInt(getUserYToken),
            UserNToken: parseInt(getUserNToken),
            contractBalance: ethers.utils.formatEther(contractBalance),
            winner: winner
        }
        setCurrentMarket(marketObj);
        return marketObj;
    }
    const fetchAllMarkets = async () => {
        
        try{
            const marketList = [];
            if(!ethereum) return alert("Please install metamask!");
            //get contract
            console.log('fetching markets');
            //get contract
            const marketTrackerContract = getEthereumContract(contractAddress, marketTrackerContractABI);
            console.log(marketTrackerContract);
            //testing if contract works
            const marketHashArray = await marketTrackerContract.getMarketArray();
            for(var i=0; i<marketHashArray.length; i++){
                const contractHash = marketHashArray[i];
                const marketContract = getEthereumContract(contractHash, marketContractABI);
                const ownerHash = await marketContract.getOwnerAddress();
                const marketName = await marketContract.getMarketName();
                
                const Y_Tokens = await marketContract.getYTokens();
                const N_Tokens = await marketContract.getNTokens();
                const getUserNToken = await marketContract.getUserNTokens();
                const getUserYToken = await marketContract.getUserYTokens();
                const Y_Price = await marketContract.getYPrice();
                const N_Price = await marketContract.getNPrice();
                const contractBalance = await marketContract.getContractBalance();
                const sides = await marketContract.getSide();
                const resultUNIXDate = await marketContract.getResultDate();
                const resultDate = new Date(resultUNIXDate.toString() * 1000);
                
                marketList.push({
                    contractHash:contractHash, 
                    ownerHash: ownerHash,
                    marketName: marketName,
                    Y_Tokens: parseInt(Y_Tokens), //1
                    N_Tokens: parseInt(N_Tokens), //0
                    Y_Price_wei: Y_Price,
                    N_Price_wei: N_Price,
                    Y_Price: ethers.utils.formatEther(Y_Price), 
                    N_Price: ethers.utils.formatEther(N_Price), 
                    sides: sides, 
                    resultDate: resultDate,
                    UserYToken: parseInt(getUserYToken),
                    UserNToken: parseInt(getUserNToken),
                    contractBalance: ethers.utils.formatEther(contractBalance)
                });

            }
            console.log(marketList);
            setListOfMarkets(marketList);
            //should return hello world
            //const createMarketTransactionHash = await marketTrackerContract.addNewMarket(marketTitle, [YTokenName, NTokenName], (Math.floor(new Date(resultDay).getTime() / 1000)), { value: ethers.utils.parseEther("1") });
            //console.log(createMarketTransactionHash); //convert to unix time

        }catch (error){
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    const checkIfStaff = async () => {
        

        try{
            if(!ethereum) return alert("Please install metamask!");
            //get contract
            console.log('Checking if you are staff');
            //get contract
            const marketTrackerContract = getEthereumContract(contractAddress, marketTrackerContractABI);
            const staffChecker = await marketTrackerContract.checkPermission();
            console.log("Staff?:",(staffChecker == true));
            if((staffChecker == true)){
                setIsStaff(true);
                return true;
            }else{
                setIsStaff(false);
                return false;
            }
            return false;
        }catch (error){
            console.log(error);
            return false;
            
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask!");
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });
            window.location.reload();
        } catch(error){
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    useEffect(() => {
        console.log("state updated");
        checkIfWalletIsConnected();
        fetchAllMarkets();
        checkIfStaff();
    }, []);

    return (
        <MarketTrackerContext.Provider value={{ connectWallet, currentAccount, currentBalance, formData, listOfMarkets, currentMarket, winning, isStaff, setIsStaff, createNewMarket, setCurrentMarket, tradeTokens, setWinningBets, collectClaims, setFormData, fetchAllMarkets, handleChange}}>
            {children}
        </MarketTrackerContext.Provider>
    )
}
