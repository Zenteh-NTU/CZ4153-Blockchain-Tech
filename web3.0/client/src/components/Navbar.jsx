import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import React, { useState, useContext } from 'react';
import { MarketTrackerContext } from '../context/MarketTrackerContext';

const NavbarItem = ({title, classProps}) => {
    return (
        <li className={'mx-4 cursor-pointer ${classProps}'}>
            {title}
        </li>
    );
}
const Navbar = ({setScreenState}) => {
    const {connectWallet, currentAccount, currentBalance} = useContext(MarketTrackerContext);
    const viewHome = () => {
        setScreenState("Welcome");
    }
    const viewMarket = () => {
        setScreenState("Market");
    }

    const viewTransactionHistory = () => {
        setScreenState("Transactions");
    }
    const [toggleMenu, setToggleMenu] = useState(false);
    return (
        <nav className="fixed w-full flex md:justify-center justify-between items-center h-16 bg-gradient-to-r from-blue-700 to-pink-900">
            <div className="cursor-pointer md:flex-[0.5] pl-10 md:pl-0 flex-initial justify-start items-center font-mono text-white text-2xl" onClick={viewHome}>
            To the moon &#127769; &#128640;
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-end items-center flex-initial">
                <li className="mx-4 cursor-pointer" onClick={viewMarket}>Market</li>
                {/* {["Market", "Wallets"].map((item, index) => (
                    <NavbarItem key={item + index} title={item} />
                ))} */}
            </ul>
            {
                !currentAccount && (
                    <>
                        <ul className="text-white md:flex hidden list-none flex-row justify-end items-center flex-initial">
                            <li className="mx-4 cursor-pointer">0.0 ETH</li>
                        </ul>
                        <button className="bg-blue-700 hover:bg-blue-500 md:flex hidden text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg " type="button" onClick={connectWallet}>Login with Metamask</button>
                    </>
                )
            }
            {
                currentAccount && (
                    <>
                        <ul className="text-white md:flex hidden list-none flex-row justify-end items-center flex-initial">
                            <li className="mx-4 cursor-pointer">{currentBalance} ETH</li>
                        </ul>
                        <button className="bg-blue-800 md:flex hidden text-white my-8 pt-2 pb-2 pl-3 pr-3 font-mono rounded shadow-pink-800 shadow-lg " type="button" onClick={viewTransactionHistory}>{currentAccount.substr(0, 8)}...{currentAccount.substr(-8,8)}</button>
                    </>
                )
            }
            <div className="flex relative pr-10">
                    {toggleMenu
                    // this doesn't work yet
                        ?<AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
                        :<HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
                    }
            </div>
        </nav>
    );
}

export default Navbar;