import React, { useState, useContext } from 'react';
import { MarketTrackerContext } from '../context/MarketTrackerContext';
const Market = ({setScreenState}) => {
    const {currentAccount , listOfMarkets} = useContext(MarketTrackerContext);
    const viewCreateMarket = () => {
        setScreenState("CreateMarket");
    }
    const percentageCal = (x,y) => {
        return ((x+1)/(x+y+2) * 100);
    }
    return (
        <div className="w-full flex justify-center pb-10 min-h-screen bg-gradient-to-r from-blue-900 to-pink-900">
            <div className="pr-0 pt-32 lg:pr-96 ">
                <h1 className="text-4xl text-white sm:text-5xl">Markets Available</h1>
                <p className=" font-mono pt-3 text-white">Here lists the many prediction markets available <br></br> Start a market or start predicting!</p>
                {
                    currentAccount && (
                        <button className="bg-red-700 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg" onClick={viewCreateMarket} >Create new market</button>
                    )
                }
                {listOfMarkets.map((item, index) => (
                    <div className=" mt-6 w-full hover:bg-black bg-zinc-900 max-h-full rounded overflow-hidden shadow-lg">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-white">{item.marketName}</div>
                        <div className="w-full h-10 items-center pb-12" >
                            <div className=" text-blue-400 text-base">
                            {item.sides[1]} - {percentageCal(item.Y_Tokens,item.N_Tokens)}%
                            </div>
                            <div className=" text-red-500 text-base">
                            {item.sides[0]} - {percentageCal(item.N_Tokens,item.Y_Tokens)}%
                            </div>
                        </div>
                    </div>
                    <div className=" w-full bg-red-500 h-2.5">
                        <div className="bg-blue-400 h-2.5" style={{ width: percentageCal(item.Y_Tokens,item.N_Tokens)+"%" }}></div>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        <span className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Contract Hash: {item.contractHash}</span>
                    </div>
                </div>

                ))}
                



            </div>
            
        </div>
    );
}

export default Market;