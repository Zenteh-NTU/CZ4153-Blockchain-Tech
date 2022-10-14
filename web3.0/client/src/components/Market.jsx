import React, { useState, useContext } from 'react';
import { MarketTrackerContext } from '../context/MarketTrackerContext';
const Market = () => {
    const {currentAccount} = useContext(MarketTrackerContext);
    return (
        <div className="w-full flex justify-center h-screen bg-gradient-to-r from-blue-900 to-pink-900">
            <div className="pr-0 pt-32 lg:pr-96 ">
                <h1 className="text-4xl text-white sm:text-5xl">Markets Available</h1>
                <p className=" font-mono pt-3 text-white">Here lists the many prediction markets available <br></br> Start a market or start predicting!</p>
                {
                    currentAccount && (
                        <button className="bg-red-700 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg" >Create new market</button>
                    )
                }


                <div className=" mt-6 w-full bg-zinc-900 max-h-full rounded overflow-hidden shadow-lg">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-white">Will Trump win the election?</div>
                        <div className="w-full h-10 items-center pb-12" >
                            <div className=" text-red-500 text-base">
                                Yes - 25% 
                            </div>
                            <div className=" text-blue-400 text-base">
                                No - 75%
                            </div>
                        </div>
                    </div>
                    <div className=" w-full bg-red-500 h-2.5">
                        <div className="bg-blue-400 h-2.5" style={{ width: "25%" }}></div>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        <span className="inline-block bg-black rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">#contract hash here</span>
                    </div>
                </div>


            </div>
            
        </div>
    );
}

export default Market;