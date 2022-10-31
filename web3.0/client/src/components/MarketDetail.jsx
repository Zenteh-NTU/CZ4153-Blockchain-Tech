import React, { useState, useContext, useEffect, useRef } from "react";
import { MarketTrackerContext } from "../context/MarketTrackerContext";

const Input = ({ placeholder, name, type, value, className, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    className={className}
    value={value}
    onChange={handleChange}
  />
);

const MarketDetail = () => {
  const {
    currentMarket,
    tradeTokens,
    setWinningBets,
    collectClaims,
    winning,
    isStaff,
  } = useContext(MarketTrackerContext);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");
  const [totalCostYBValue, setTotalCostYBValue] = useState("0");
  const [totalCostYSValue, setTotalCostYSValue] = useState("0");
  const [totalCostNBValue, setTotalCostNBValue] = useState("0");
  const [totalCostNSValue, setTotalCostNSValue] = useState("0");
  console.log(winning);
  const handleChange1 = (event) => {
    const result = event.target.value.replace(/\D/g, "");
    setValue1(result);
    setTotalCostYBValue(parseFloat((parseFloat(result) * currentMarket.Y_Price)).toFixed(3));
  };

  const handleChange2 = (event) => {
    const result = event.target.value.replace(/\D/g, "");
    setValue2(result);
    setTotalCostYSValue(parseFloat((parseFloat(result) * currentMarket.Y_Price / 2)).toFixed(3));
  };

  const handleChange3 = (event) => {
    const result = event.target.value.replace(/\D/g, "");
    setValue3(result);
    setTotalCostNBValue(parseFloat((parseFloat(result) * currentMarket.N_Price)).toFixed(3));
  };

  const handleChange4 = (event) => {
    const result = event.target.value.replace(/\D/g, "");
    setValue4(result);
    setTotalCostNSValue(parseFloat((parseFloat(result) * currentMarket.N_Price / 2)).toFixed(3));
  };

  const outcomeDate = (dateObject) => {
    return dateObject.toString();
  };

  const marketCloseDate = (dateObject) => {
    const unixtime = Math.floor(dateObject.getTime() / 1000) - 604800;
    const marketClose = new Date(unixtime * 1000);
    console.log(marketClose);
    return marketClose.toString();
  };

  const percentageCal = (x, y) => {
    return ((x + 1) / (x + y + 2)) * 100;
  };

  const handleSubmit = (string, contract, price, value) => {
    if (value === "") {
      alert("Please enter a value, e.g 123");
    } else {
      value = parseInt(value);
      if (string === "buyY") {
        setValue1("");
      } else if (string === "sellY") {
        setValue2("");
      } else if (string === "buyN") {
        setValue3("");
      } else {
        setValue4("");
      }
      tradeTokens(string, contract, value, price);
    }
  };

  const winnerYTokens = async () => {
    await setWinningBets(1, 0, currentMarket.contractHash);
  };

  const winnerNTokens = async () => {
    await setWinningBets(0, 1, currentMarket.contractHash);
  };

  const collectWinnings = async () => {
    console.log("Collect winnings");
    collectClaims(currentMarket.contractHash);
  };

  return (
    <div className="w-full flex justify-center min-h-screen bg-gradient-to-r from-blue-900 to-pink-900">
      <div className="pt-32 ">
        <h1 className="text-4xl text-white sm:text-5xl">
          {currentMarket.marketName}
        </h1>
        <h1 className="text-white mt-1">
          Winning Bet Result:{" "}
          {!currentMarket.oracleDecision
            ? "[Not Yet decided]"
            : currentMarket.sides[currentMarket.winner]}
        </h1>
        {currentMarket.oracleDecision && (
          <div className="pt-4">
            <span className="inline-block bg-yellow-400 rounded-full px-3 py-1 text-sm font-semibold text-black mb-2">
              MARKET RESOLVED
            </span>
          </div>
        )}
        <div className="pt-4">
          <span className="inline-block bg-slate-900 rounded-full px-3 py-1 text-sm font-semibold text-white mb-2">
            Outcome Date: {outcomeDate(currentMarket.resultDate)}
          </span>
        </div>

        <div>
          <span className="inline-block bg-slate-900 rounded-full px-3 py-1 text-sm font-semibold text-white mb-2">
            Market Close Date: {marketCloseDate(currentMarket.resultDate)}
          </span>
        </div>

        <div className=" mt-6 w-full p-5 bg-zinc-900 max-h-full rounded overflow-hidden shadow-lg">
          <div className="w-full h-10 flex justify-between">
            <div className=" text-blue-400 text-3xl w-fit">
              {currentMarket.sides[1]} -{" "}
              {parseFloat(
                percentageCal(currentMarket.Y_Tokens, currentMarket.N_Tokens)
              ).toFixed(2)}
              %
            </div>
            <div className="w-fit text-right text-3xl text-red-500">
              {currentMarket.sides[0]} -{" "}
              {parseFloat(
                percentageCal(currentMarket.N_Tokens, currentMarket.Y_Tokens)
              ).toFixed(2)}
              %
            </div>
          </div>
          <div className=" w-full bg-red-500 h-5">
            <div
              className="bg-blue-400 h-5"
              style={{
                width:
                  percentageCal(
                    currentMarket.Y_Tokens,
                    currentMarket.N_Tokens
                  ) + "%",
              }}
            ></div>
          </div>

          <p className=" font-mono pt-3 text-white">
            Price of Y-Token{" "}
            <span className=" text-blue-300">
              (Option:{currentMarket.sides[1]})
            </span>
            : {parseFloat(currentMarket.Y_Price).toFixed(3).toString()} ETH each
          </p>
          <p className=" font-mono pt-3 text-white">
            Price of N-Token{" "}
            <span className=" text-red-400">
              (Option:{currentMarket.sides[0]})
            </span>
            : {parseFloat(currentMarket.N_Price).toFixed(3).toString()} ETH each
          </p>
          <p className=" font-mono pt-3 text-white">
            Total Tokens circulated:{" "}
            {(currentMarket.Y_Tokens + currentMarket.N_Tokens).toString()}
          </p>
          <p className=" font-mono pt-3 text-white">
            Prize Pool:{" "}
            {parseFloat(currentMarket.contractBalance).toFixed(3).toString()}
            ETH
          </p>
          <hr className="mt-4"></hr>
          <div className="pt-4">
            <span className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold text-white mb-2">
              Market Hash: {currentMarket.contractHash}
            </span>
          </div>
          <div>
            <span className="inline-block bg-slate-700 rounded-full px-3 py-1 text-sm font-semibold text-white mb-2">
              Created by: {currentMarket.ownerHash}
            </span>
          </div>
          {isStaff && !currentMarket.oracleDecision && (
            <div className="flex flex-col pt-4 text-white">
              Oracle/Staff Action: Who won?
              <div>
                <button
                  className="bg-blue-500 w-auto text-white mt-5 mr-5 pt-2 pb-2 pl-5 pr-5 font-mono rounded shadow-sky-700 shadow-lg"
                  onClick={() => {
                    if (confirm("Are you sure?") == true) {
                      winnerYTokens();
                    } else {
                    }
                  }}
                >
                  {currentMarket.sides[1]}
                </button>
                <button
                  className="bg-red-500 w-auto text-white mt-5 pt-2 pb-2 pl-5 pr-5 font-mono rounded shadow-pink-700 shadow-lg"
                  onClick={() => {
                    if (confirm("Are you sure?") == true) {
                      winnerNTokens();
                    } else {
                    }
                  }}
                >
                  {currentMarket.sides[0]}
                </button>
              </div>
            </div>
          )}
        </div>
        {!isStaff && (
          <div className=" mt-6 mb-24 w-full  bg-zinc-900 max-h-full rounded overflow-hidden shadow-lg flex flex-col items-center">
            <br />
            <h1 className="p-5 text-white text-2xl">Buy and Sell</h1>
            <div className="flex flex-col lg:flex-row">
              <div className="m-5 p-5 lg:ml-5 lg:mr-0 lg:mt-5 lg:mb-5 bg-sky-900 max-h-full rounded overflow-hidden shadow-lg">
                <button className="text-white" onClick={() => winnerYTokens()}>
                  Choose as Winner
                </button>
                <h1 className="text-white bg text-2xl">Y-Token</h1>
                <p className="pt-3 text-xl text-white">
                  You own: {currentMarket.UserYToken} Y-Tokens
                </p>
                <h1 className="text-xl pt-3 text-white bg sm:text-xl">
                  I want to buy..
                </h1>
                <div className="flexalign-middle">
                  <Input
                    name="YTokenAmt"
                    handleChange={handleChange1}
                    value={value1}
                    className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400"
                    placeholder="Enter the number of Y-tokens..."
                    type="text"
                    id="buyY"
                  />
                  <span className="text-xl pt-3 text-white "> Y-Token(s)</span>
                  <p className="pt-3 text-white">
                    Price of Y-Token{" "}
                    <span className=" text-blue-300">
                      (Option:{currentMarket.sides[1]})
                    </span>
                    : {parseFloat(currentMarket.Y_Price).toFixed(3).toString()}{" "}
                    ETH each
                  </p>
                  <p className=" text-white">Quanity to buy: {value1}</p>
                  <p className=" text-white">
                    Total Cost: {parseFloat(totalCostYBValue).toFixed(3).toString()} ETH
                  </p>
                  {!currentMarket.oracleDecision && (
                    <button
                      className="bg-blue-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-sky-700 shadow-lg"
                      onClick={() =>
                        handleSubmit(
                          "buyY",
                          currentMarket.contractHash,
                          currentMarket.Y_Price,
                          value1
                        )
                      }
                    >
                      BUY
                    </button>
                  )}
                  {currentMarket.oracleDecision && (
                    <button
                      className="bg-blue-500 w-36 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-sky-700 shadow-lg"
                      disabled
                    >
                      MARKET OVER
                    </button>
                  )}
                </div>

                <hr></hr>
                <h1 className="text-xl pt-3 text-white bg sm:text-xl">
                  I want to sell..
                </h1>
                <div className="align-middle">
                  <Input
                    name="YTokenAmt"
                    handleChange={handleChange2}
                    value={value2}
                    className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400"
                    placeholder="Enter the number of Y-tokens..."
                    type="text"
                    id="sellY"
                  />
                  <span className="text-xl pt-3 text-white "> Y-Token(s)</span>

                  <p className=" font-mono pt-3 text-white">
                    Price of Y-Token{" "}
                    <span className=" text-blue-300">
                      (Option:{currentMarket.sides[1]})
                    </span>
                    : {parseFloat(currentMarket.Y_Price/2).toFixed(3).toString()}{" "}
                    ETH each
                  </p>
                  <p className=" font-mono text-white">
                    Quanity to sell: {value2}
                  </p>
                  <p className=" text-white">
                    Total Cost: {parseFloat(totalCostYSValue).toFixed(3).toString()} ETH
                  </p>
                  {!currentMarket.oracleDecision && (
                    <button
                      className="bg-red-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-700 shadow-lg"
                      onClick={() =>
                        handleSubmit(
                          "sellY",
                          currentMarket.contractHash,
                          currentMarket.Y_Price,
                          value2
                        )
                      }
                    >
                      SELL
                    </button>
                  )}
                  {currentMarket.oracleDecision && (
                    <button
                      className="bg-red-500 w-36 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-700 shadow-lg"
                      disabled
                    >
                      MARKET OVER
                    </button>
                  )}
                </div>
              </div>
              <div className="m-5 p-5 bg-red-900 max-h-full rounded overflow-hidden shadow-lg col-start-13">
                <button className="text-white" onClick={() => winnerNTokens()}>
                  Choose as Winner
                </button>
                <h1 className="text-white text-2xl">N-Token</h1>
                <p className="pt-3 text-xl text-white">
                  You own: {currentMarket.UserNToken} N-Tokens
                </p>
                <h1 className="text-xl pt-3 text-white bg sm:text-xl">
                  I want to buy..
                </h1>
                <div className="align-middle">
                  <Input
                    name="YTokenAmt"
                    handleChange={handleChange3}
                    value={value3}
                    className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400"
                    placeholder="Enter the number of N-tokens..."
                    type="text"
                    id="buyN"
                  />
                  <span className="text-xl pt-3 text-white "> N-Token(s)</span>

                  <p className=" font-mono pt-3 text-white">
                    Price of N-Token{" "}
                    <span className=" text-red-400">
                      (Option:{currentMarket.sides[0]})
                    </span>
                    : {parseFloat(currentMarket.N_Price).toFixed(3).toString()}{" "}
                    ETH each
                  </p>
                  <p className=" font-mono text-white">
                    Quantity to buy: {value3}
                  </p>
                  <p className=" text-white">
                    Total Cost: {parseFloat(totalCostNBValue).toFixed(3).toString()} ETH
                  </p>
                  {!currentMarket.oracleDecision && (
                    <button
                      className="bg-blue-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-sky-700 shadow-lg"
                      onClick={() =>
                        handleSubmit(
                          "buyN",
                          currentMarket.contractHash,
                          currentMarket.N_Price,
                          value3
                        )
                      }
                    >
                      BUY
                    </button>
                  )}
                  {currentMarket.oracleDecision && (
                    <button
                      className="bg-blue-500 w-36 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-sky-700 shadow-lg"
                      disabled
                    >
                      MARKET OVER
                    </button>
                  )}
                </div>
                <hr></hr>
                <h1 className="text-xl pt-3 text-white bg sm:text-xl">
                  I want to sell..
                </h1>
                <div className="flexalign-middle">
                  <Input
                    name="YTokenAmt"
                    handleChange={handleChange4}
                    value={value4}
                    className=" w-auto bg-transparent text-xl pt-3 text-white placeholder:font-normal placeholder:italic placeholder:text-blue-400"
                    placeholder="Enter the number of N-tokens..."
                    type="text"
                    id="sellN"
                  />
                  <span className="text-xl pt-3 text-white "> N-Token(s)</span>

                  <p className=" font-mono pt-3 text-white">
                    Price of N-Token{" "}
                    <span className=" text-red-400">
                      (Option:{currentMarket.sides[0]})
                    </span>
                    : {parseFloat(currentMarket.N_Price/2).toFixed(3).toString()}{" "}
                    ETH each
                  </p>
                  <p className=" font-mono text-white">
                    Quanity to sell: {value4}
                  </p>
                  <p className=" text-white">
                    Total Cost: {parseFloat(totalCostNSValue).toFixed(3).toString()} ETH
                  </p>
                  {!currentMarket.oracleDecision && (
                    <button
                      className="bg-red-500 w-24 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-700 shadow-lg"
                      onClick={() =>
                        handleSubmit(
                          "sellN",
                          currentMarket.contractHash,
                          currentMarket.N_Price,
                          value4
                        )
                      }
                    >
                      SELL
                    </button>
                  )}
                  {currentMarket.oracleDecision && (
                    <button
                      className="bg-red-500 w-36 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-700 shadow-lg"
                      disabled
                    >
                      MARKET OVER
                    </button>
                  )}
                </div>
              </div>
            </div>
            {currentMarket.oracleDecision && (
              <div className="flex flex-col mt-12 mb-24 items-center text-center w-96">
                <div className="pt-4">
                  <span className="inline-block bg-yellow-400 rounded-full px-3 py-1 text-sm font-semibold text-black mb-2">
                    MARKET RESOLVED
                  </span>
                </div>
                <h2 className="text-white">
                  Claim your gains, if any, after the winner has been anounced
                </h2>
                <button
                  className="bg-blue-500 w-24 mt-12 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-sky-700 shadow-lg"
                  type="submit"
                  onClick={() => collectWinnings()}
                >
                  Claim
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketDetail;
