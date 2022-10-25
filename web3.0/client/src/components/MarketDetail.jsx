import React, { useState, useContext, useEffect } from 'react';
import { MarketTrackerContext, tradeTokens } from '../context/MarketTrackerContext';

const Input = ({ placeholder, name, type, value, className, handleChange }) => (
    <input
      placeholder={placeholder}
      type={type}
      className={className}
      value={value}
      onChange={(e) => handleChange(e, value)}
    />
  );

const MarketDetail = () => {
    const { currentMarket, handleChange } = useContext(MarketTrackerContext);
    const [ getValue, setValue ] = useState(1);

    const outcomeDate = (dateObject) => {
        return dateObject.toString();
    }

    const marketCloseDate = (dateObject) => {
        const unixtime = Math.floor(dateObject.getTime() / 1000) - 604800;
        const marketClose = new Date(unixtime * 1000);
        console.log(marketClose);
        return marketClose.toString();
    }
    const percentageCal = (x, y) => {
        return ((x + 1) / (x + y + 2) * 100);
    }

    const handleSubmit = (string, contract, price) => {
        const data = getValue;
        console.log(data);
        if (data !== null) {
            tradeTokens(string, contract, data, price);
        }
    }

    return (
        <div className="w-full flex justify-center min-h-screen bg-gradient-to-r from-blue-900 to-pink-900">
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
                        <div className=" text-blue-400 text-3xl w-fit">
                            {currentMarket.sides[1]} - {percentageCal(currentMarket.Y_Tokens, currentMarket.N_Tokens)}%
                        </div>
                        <div className="w-fit text-right text-3xl text-red-500">
                            {currentMarket.sides[0]} - {percentageCal(currentMarket.N_Tokens, currentMarket.Y_Tokens)}%
                        </div>

                    </div>
                    <div className=" w-full bg-red-500 h-5">
                        <div className="bg-blue-400 h-5" style={{ width: percentageCal(currentMarket.Y_Tokens, currentMarket.N_Tokens) + "%" }}></div>
                    </div>

                    <p className=" font-mono pt-3 text-white">Price of Y-Token <span className=' text-blue-300'>(Option:{currentMarket.sides[1]})</span>: {currentMarket.Y_Price} ETH each</p>
                    <p className=" font-mono pt-3 text-white">Price of N-Token <span className=' text-red-400'>(Option:{currentMarket.sides[0]})</span>: {currentMarket.N_Price} ETH each</p>
                    <hr className='mt-4'></hr>
                    <div className="pt-4">
                        <span className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Market Hash: {currentMarket.contractHash}</span>
                    </div>
                    <div>
                        <span className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Created by: {currentMarket.ownerHash}</span>
                    </div>
                </div>

                <div className=" mt-6 w-full p-5 bg-zinc-900 max-h-full rounded overflow-hidden shadow-lg grid grid-cols-0 justify-between">
                    <h1 className="text-4xl text-white sm:text-2xl">Buy and Sell</h1>
                    <div className="mt-16 w-11/12 p-5 bg-sky-900 max-h-full rounded overflow-hidden shadow-lg col-start-1">
                        <h1 className="text-4xl text-white bg sm:text-2xl">Y-Token</h1>
                        <p className="font-mono pt-3 text-xl text-white">You own: { currentMarket.User_Y_Tokens } Y-Tokens</p>
                        <h1 className="text-xl pt-3 text-white bg sm:text-xl">I want to buy..</h1>
                        <div className='flexalign-middle'>
                            <Input name="YTokenAmt" handleChange={ handleChange } className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400" value="1" placeholder="1" type="number" id="buyY" />
                            <span className='text-xl pt-3 text-white '> Y-Token(s)</span>
                            <p className=" font-mono pt-3 text-white">Price of Y-Token <span className=' text-blue-300'>(Option:{currentMarket.sides[1]})</span>: {currentMarket.Y_Price} ETH each</p>
                            <p className=" font-mono text-white">Quanity to buy: { getValue }</p>
                            <button className="bg-blue-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-sky-700 shadow-lg" onClick={ () => handleSubmit("buyY", currentMarket.contractHash, currentMarket.Y_Price) }>BUY</button>
                        </div>

                        <hr></hr>
                        <h1 className="text-xl pt-3 text-white bg sm:text-xl">I want to sell..</h1>
                        <div className='flexalign-middle'>
                            <Input name="YTokenAmt" handleChange={ handleChange } className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400" value="1" placeholder="1" type="number" id="sellY" />
                            <span className='text-xl pt-3 text-white '> Y-Token(s)</span>

                            <p className=" font-mono pt-3 text-white">Price of Y-Token <span className=' text-blue-300'>(Option:{currentMarket.sides[1]})</span>: {currentMarket.Y_Price} ETH each</p>
                            <p className=" font-mono text-white">Quanity to sell: { getValue }</p>
                            <button className="bg-red-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-700 shadow-lg" onClick={ () => handleSubmit("sellY", currentMarket.contractHash, currentMarket.Y_Price) }>SELL</button>
                        </div>
                    </div>
                    <div className="mt-16 w-11/12 p-5 bg-red-900 max-h-full rounded overflow-hidden shadow-lg col-start-13">
                        <h1 className="text-4xl text-white sm:text-2xl">N-Token</h1>
                        <p className="font-mono pt-3 text-xl text-white">You own: { currentMarket.User_N_Tokens } N-Tokens</p>
                        <h1 className="text-xl pt-3 text-white bg sm:text-xl">I want to buy..</h1>
                        <div className='flexalign-middle'>
                            <Input name="YTokenAmt" handleChange={ handleChange } className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400" value="1" placeholder="1" type="number" id="buyN" />
                            <span className='text-xl pt-3 text-white '> N-Token(s)</span>

                            <p className=" font-mono pt-3 text-white">Price of N-Token <span className=' text-red-400'>(Option:{currentMarket.sides[0]})</span>: {currentMarket.N_Price} ETH each</p>
                            <p className=" font-mono text-white">Quantity to buy: { getValue }</p>

                            <button className="bg-blue-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-sky-700 shadow-lg" onClick={ () => handleSubmit("buyN", currentMarket.contractHash, currentMarket.N_Price) }>BUY</button>
                        </div>
                        <hr></hr>
                        <h1 className="text-xl pt-3 text-white bg sm:text-xl">I want to sell..</h1>
                        <div className='flexalign-middle'>
                            <Input name="YTokenAmt" handleChange={ handleChange } className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400" value="1" placeholder="1" type="number" id="sellN" />
                            <span className='text-xl pt-3 text-white '> N-Token(s)</span>

                            <p className=" font-mono pt-3 text-white">Price of N-Token <span className=' text-red-400'>(Option:{currentMarket.sides[0]})</span>: {currentMarket.N_Price} ETH each</p>
                            <p className=" font-mono text-white">Quanity to sell: { getValue }</p>

                            <button className="bg-red-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-700 shadow-lg" onClick={ () => handleSubmit("sellN", currentMarket.contractHash, currentMarket.N_Price) }>SELL</button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default MarketDetail;