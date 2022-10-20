import React, { useState, useContext } from 'react';
const Welcome = ({setScreenState}) => {

    const viewMarket = () => {
        setScreenState("Market");
    }
    return (
        <div className="w-full flex justify-center min-h-screen bg-gradient-to-r from-blue-900 to-pink-900">
            <div className="pr-0 pt-48 lg:pr-96 ">
                <h1 className="text-4xl text-white sm:text-5xl">This website is for creating and predicting in markets</h1>
                <p className='font-mono pt-3 text-white'>What is a market? A market is a question that has a definite answer known to public</p>
                <p className='font-mono pt-3 text-white'>&#9989; Will Donald Trump become the President of the United States in 2024? </p>
                <p className='font-mono pt-3 text-white'>&#10062; Who will win the 2022 Football World Cup?</p>
                <p className='font-mono pt-3 text-white'>In the event that our Oracle cannot decide the answer either because it is too complicated or it is personal, we will refund the money back</p>
                <h1 className="text-4xl text-white sm:text-5xl">Trade in <br></br> Prediction Markets</h1>
                <p className=" font-mono pt-3 text-white">Explore many different prediction markets. <br></br> Make your prediction and earn cryptocurrencies.</p>
                <button className="bg-blue-700 hover:bg-blue-500 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg" onClick={viewMarket} >View Markets Available</button>
            </div>
        </div>
    );
}

export default Welcome;