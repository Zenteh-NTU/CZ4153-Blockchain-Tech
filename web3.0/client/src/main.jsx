import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MarketTrackerProvider } from './context/MarketTrackerContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <MarketTrackerProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MarketTrackerProvider>
)
