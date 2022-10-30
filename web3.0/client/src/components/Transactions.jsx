import React, { useState, useContext } from 'react';
import { MarketTrackerContext } from '../context/MarketTrackerContext';
const Transactions = () => {
    const {listOfTransactions, setListOfTransactions,} = useContext(MarketTrackerContext);
    return (
        <div className="w-screen flex justify-center min-h-screen bg-gradient-to-r from-blue-900 to-pink-900">
             <div className="pr-0 pt-32 lg:pr-96 ">
                <h1 className="text-4xl text-white sm:text-3xl">Transaction History</h1>
                {listOfTransactions.map((item, index) => (
                    <div key={index} className=" mt-6 hover:bg-black w-[32rem] pb-5 bg-zinc-900 rounded overflow-hidden shadow-lg">
                    <div className="flex justify-between px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-white">{item.transactionType}</div>
                        <div className="font-bold text-xl mb-2 text-white">{(item.transactionType == "Reward Claim" || item.transactionType == "Sell") ? '+' : '-'}{parseFloat(item.ethereumValue).toFixed(3)} ETH</div>
                    </div>
                    
                    <div className='flex px-5'>

                    <div className="">
                        <span className="inline-block bg-slate-700 rounded-full text-sm font-semibold pt-1 pb-1 pl-2 pr-2 text-white mr-2 mb-2">Market Contract: {item.recipientHash.substr(0, 4)}...{item.recipientHash.substr(-4,4)}</span>
                    </div>
                    {
                        (item.tokenType == 'Y-Token' || item.tokenType == 'N-Token') &&
                    (<div className="">
                        <span className={"inline-block rounded-full text-sm font-semibold pt-1 pb-1 pl-2 pr-2 text-white mr-2 mb-2 "+((item.tokenType == 'Y-Token') ? "bg-blue-700" : "bg-red-700")}>{item.tokenType} : {item.tokenCount}</span>
                    </div>
                    )
}
                    </div>

                </div>

                ))}
                

                </div>
        </div>
    );
}

export default Transactions;