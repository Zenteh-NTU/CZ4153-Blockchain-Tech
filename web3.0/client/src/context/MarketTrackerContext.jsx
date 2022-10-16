import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { marketTrackerContractABI, marketContractABI, transactionsABI, contractAddress } from '../utils/constants';

export const MarketTrackerContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = (smartContractAddress, ABI) => {
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
    const [currentBalance, setCurrentBalance] = useState('');
    const [listOfMarkets, setListOfMarkets] = useState([]);
    const [currentMarket, setCurrentMarket] = useState({});
    const [formData, setFormData] = useState({marketTitle: '', YTokenName: '', NTokenName:'', resultDay: ''});

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

                const Y_Price = await marketContract.getYPrice();
                const N_Price = await marketContract.getNPrice();

                const sides = await marketContract.getSide();
                const resultUNIXDate = await marketContract.getResultDate();
                const resultDate = new Date(resultUNIXDate.toString() * 1000);
                
                marketList.push({
                    contractHash:contractHash, 
                    ownerHash: ownerHash,
                    marketName: marketName,
                    Y_Tokens: parseInt(Y_Tokens), //1
                    N_Tokens: parseInt(N_Tokens), //0
                    Y_Price: ethers.utils.formatEther(Y_Price), 
                    N_Price: ethers.utils.formatEther(N_Price), 
                    sides: sides, 
                    resultDate: resultDate
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
        checkIfWalletIsConnected();
        fetchAllMarkets();
    }, []);

    return (
        <MarketTrackerContext.Provider value={{ connectWallet, currentAccount, currentBalance, formData, listOfMarkets, currentMarket, createNewMarket, setCurrentMarket, setFormData, fetchAllMarkets, handleChange}}>
            {children}
        </MarketTrackerContext.Provider>
    )
}