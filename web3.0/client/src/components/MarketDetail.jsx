import React, { useState, useContext } from 'react';
import { MarketTrackerContext } from '../context/MarketTrackerContext';
const MarketDetail = () => {
    const {currentMarket} = useContext(MarketTrackerContext);
    const outcomeDate = (dateObject) => {
        return dateObject.toString();
    }

    const marketCloseDate = (dateObject) => {
        const unixtime = Math.floor(dateObject.getTime() / 1000) - 604800;
        const marketClose = new Date(unixtime * 1000);
        console.log(marketClose);
        return marketClose.toString();
    }
    console.log(currentMarket);
    return (
        <div className="w-full flex justify-center h-screen bg-gradient-to-r from-blue-900 to-pink-900">
            <div className="pr-0 pt-32 lg:pr-96 ">
                <h1 className="text-4xl text-white sm:text-5xl">{currentMarket.marketName}</h1>
                <div className="pt-4">
                        <span className="inline-block bg-slate-900 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Market Hash: {currentMarket.contractHash}</span>
                </div>
                <div>
                        <span className="inline-block bg-slate-900 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Created by: {currentMarket.ownerHash}</span>
                </div>
                <p className=" font-mono pt-3 text-white">Event Date: {outcomeDate(currentMarket.resultDate)}</p>
                <p className=" font-mono pt-3 text-white">Market Close Date: {marketCloseDate(currentMarket.resultDate)}</p>
                <p className=" font-mono pt-3 text-white">Price of Y-Token: {currentMarket.Y_Price} ETH each</p>
                <p className=" font-mono pt-3 text-white">Price of N-Token: {currentMarket.N_Price} ETH each</p>

            </div>
            
        </div>
    );
}

export default MarketDetail;