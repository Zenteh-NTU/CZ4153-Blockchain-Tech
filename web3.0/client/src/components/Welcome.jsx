import React, { useState, useContext } from 'react';
const Welcome = ({setScreenState}) => {

    const viewMarket = () => {
        setScreenState("Market");
    }
    return (
        <div className="w-full flex justify-center h-screen bg-gradient-to-r from-blue-900 to-pink-900">
            <div className="pr-0 pt-48 lg:pr-96 ">
                <h1 className="text-4xl text-white sm:text-5xl">Trade in <br></br> Prediction Markets</h1>
                <p className=" font-mono pt-3 text-white">Explore many different prediction markets. <br></br> Make your prediction and earn cryptocurrencies.</p>
                <button className="bg-blue-700 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg" onClick={viewMarket} >View Markets Available</button>
            </div>
            
        </div>
    );
}

export default Welcome;