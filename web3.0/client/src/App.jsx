import { Navbar , Welcome, Footer , Services, Transactions, Market, MarketDetail } from './components';
import { useState } from 'react';
const App = () => {
  const [activeWindow, setActiveWindow] = useState("Welcome");
  return (
    <div className="min-h-screen">
      <div>
        {<Navbar setScreenState={setActiveWindow}/>}
        {activeWindow === "Welcome" && <Welcome setScreenState={setActiveWindow}/>}
        {activeWindow === "Market" && <Market/>}
        {activeWindow === "MarketDetail" && <MarketDetail/>}
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
