import { Navbar , Welcome, Footer , CreateMarket, Transactions, Market, MarketDetail } from './components';
import { useState } from 'react';
const App = () => {
  const [activeWindow, setActiveWindow] = useState("Welcome");
  return (
    <div className="min-h-screen">
      <div>
        {<Navbar setScreenState={setActiveWindow}/>}
        {activeWindow === "Welcome" && <Welcome setScreenState={setActiveWindow}/>}
        {activeWindow === "Market" && <Market setScreenState={setActiveWindow}/>}
        {activeWindow === "MarketDetail" && <MarketDetail/>}
        {activeWindow === "CreateMarket" && <CreateMarket/>}
        {/* <MarketDetail/> */}
      </div>
        {/* <Services/>
        <Transactions/>
        <Market/>
        <Footer/> */}
    </div>
  )
}

export default App;
