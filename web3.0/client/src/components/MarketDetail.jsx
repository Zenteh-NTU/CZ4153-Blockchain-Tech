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
    const percentageCal = (x,y) => {
        return ((x+1)/(x+y+2) * 100);
    }
    return (
        <div className="w-full flex justify-center h-screen bg-gradient-to-r from-blue-900 to-pink-900">
            <div className="pr-0 pt-32 lg:pr-96 ">
                <h1 className="text-4xl text-white sm:text-5xl">{currentMarket.marketName}</h1>

                <div className="pt-4">
                    <span className="inline-block bg-slate-900 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Outcome Date: {outcomeDate(currentMarket.resultDate)}</span>
                </div>
                <div>
                    <span className="inline-block bg-slate-900 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Market Close Date: {marketCloseDate(currentMarket.resultDate)}</span>
                </div>

                <div className=" mt-6 w-full p-5 bg-zinc-900 max-h-full rounded overflow-hidden shadow-lg">
                    <div className="w-full h-10 flex justify-between" >
                        <div className=" text-blue-400 w-fit text-base">
                            {currentMarket.sides[1]} - {percentageCal(currentMarket.Y_Tokens, currentMarket.N_Tokens)}%
                        </div>
                        <div className="w-fit text-right text-red-500 text-base">
                            {currentMarket.sides[0]} - {percentageCal(currentMarket.N_Tokens, currentMarket.Y_Tokens)}%
                        </div>

                    </div>
                    <div className=" w-full bg-red-500 h-5">
                        <div className="bg-blue-400 h-5" style={{ width: percentageCal(currentMarket.Y_Tokens, currentMarket.N_Tokens) + "%" }}></div>
                    </div>

                    <p className=" font-mono pt-3 text-white">Price of Y-Token: {currentMarket.Y_Price} ETH each</p>
                    <p className=" font-mono pt-3 text-white">Price of N-Token: {currentMarket.N_Price} ETH each</p>
                    <div className="pt-4">
                        <span className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Market Hash: {currentMarket.contractHash}</span>
                    </div>
                    <div>
                        <span className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Created by: {currentMarket.ownerHash}</span>
                    </div>
                </div>
                
                

            </div>
            
        </div>
    );
}

export default MarketDetail;