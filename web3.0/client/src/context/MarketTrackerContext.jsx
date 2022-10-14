import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { marketTrackerContractABI, marketContractABI, contractAddress } from '../utils/constants';

export const MarketTrackerContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const marketTrackerContract = new ethers.Contract(contractAddress, marketTrackerContractABI, signer);

    console.log({
        provider,
        signer,
        marketTrackerContract
    });
}

export const MarketTrackerProvider = ({ children }) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const [currentAccount, setCurrentAccount] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');

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
    }, []);

    return (
        <MarketTrackerContext.Provider value={{ connectWallet, currentAccount, currentBalance }}>
            {children}
        </MarketTrackerContext.Provider>
    )
}