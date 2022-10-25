import React, { useState, useContext } from 'react';
import { MarketTrackerContext } from '../context/MarketTrackerContext';
import moment from 'moment';

const Input = ({ placeholder, name, type, value, className, handleChange }) => (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => handleChange(e, name)}
      className={className}
    />
  );

  const DateInput = ({ placeholder, name, type, value, min, className, handleChange }) => (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => handleChange(e, name)}
      min={min}
      className={className}
    ></input>
  );


const CreateMarket = ({setScreenState}) => {
    const [endDate, setEndDate] = useState(moment (new Date).add(2, 'w').format('YYYY-MM-DD'));
    const { formData, createNewMarket, fetchAllMarkets, handleChange } = useContext(MarketTrackerContext);
    const handleSubmit = (e) => {
        const { marketTitle, YTokenName, NTokenName, resultDay } = formData;
        e.preventDefault();
        
        if(!marketTitle || !YTokenName || !NTokenName || !resultDay) {
            alert("Please make sure all fields are entered");
            return;
        }
        createNewMarket();


    }

    const fetchMarkets = (e) => {
        const { marketTitle, YTokenName, NTokenName, resultDay } = formData;
        e.preventDefault();
        
        fetchAllMarkets();


    }


    //const min_date = new Date();
    //setEndDate(moment (min_date).format('YYYY-MM-DD'));
    //console.log(min_date);
    return (
        <div className="w-full flex justify-center h-screen bg-gradient-to-r from-blue-900 to-pink-900">
            <div className="pr-0 pt-32 lg:pr-0 ">
                <h1 className="text-4xl text-white sm:text-3xl">Create a prediction market</h1>

                <form className=" mt-6 w-full bg-black max-h-full rounded overflow-hidden shadow-lg">
                    <div className="w-full px-6 py-4">
                        <Input name="marketTitle" handleChange={handleChange} className="w-full bg-transparent font-bold placeholder:font-normal placeholder:italic text-xl mb-2 text-white" placeholder="Awesome title for your prediction market..." type="text"/>
                        <div className="w-full h-10 items-center pb-12" >
                            <div>
                                <Input name="YTokenName" handleChange={handleChange} className="w-full bg-transparent text-blue-300 text-base placeholder:font-normal placeholder:italic placeholder:text-blue-400" placeholder="Type your first bet option...(Y-Token)" type="text"/>
                            </div>
                            <div>
                                <Input name="NTokenName" handleChange={handleChange} className="w-full bg-transparent text-red-300 text-base placeholder:font-normal placeholder:italic placeholder:text-red-600 " placeholder="Type your second bet option...(N-Token)" type="text"/>
                            </div>
                        </div>
                    </div>
                    <div className=" w-full bg-red-500 h-2.5">
                        <div className="bg-blue-400 h-2.5" style={{ width: "50%" }}></div>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        <p className="text-white text-base">Contract Result day:</p>
                        <DateInput name="resultDay" handleChange={handleChange} className="bg-transparent text-white placeholder-slate-400" min={endDate} type="date"/>                
                    </div>
                    <div className="px-6 pt-4 pb-2">
                    <button onClick={handleSubmit} type="button" className="bg-blue-600 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg" >Create market*</button>
                    {/* <button onClick={fetchMarkets} type="button" className="bg-red-700 text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg" >Fetch market*</button> */}
                    <p className='font-mono pt-3 text-xs text-white'>*This transaction can NOT be reversed. A fee of 1 Ether will be paid upon the creation of this market.</p>
                        
                    </div>
                    
                </form>

                <h1 className="text-4xl underline text-white pt-32 sm:text-2xl">Additional Info</h1>
                <ul className=" font-mono pt-3 list-disc text-white">
                    <li>A fee of 1 Ether will be paid upon the creation of this market.</li>
                    <li>The market will close 7 days before event result.</li>
                    <li>This market must be based on a real world event.</li>
                    <li>The outcome of this market will be verified by an oracle. The oracle will verify the results based on factual information.</li>
                    <li>If the decided outcome by the oracle is determined to be false, please send an email to us at toTheMoon@gmail.com.</li>
                </ul>

            </div>
            
        </div>
    );
}

export default CreateMarket;