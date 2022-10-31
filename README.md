# CZ4153-Blockchain-Tech 
Project for CZ4153-Blockchain-Tech 
# Installation and running of the Decentralized Web App
___
## Prerequisites 
To deploy your program, you need to have the following installed:    
1. NodeJS - https://nodejs.org/en/
2. Ganache - https://trufflesuite.com/ganache/
3. Metamask extension
    - Firefox - https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/
    - Chrome - https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

Before proceeding with the next steps, it is very important that you have both Ganache running and all 3 of the program requirements installed on your machine.
## Deploying the Smart Contracts
To deploy the Smart Contracts, you will first need to run `npm install` in the `web3.0/smart_contract` folder.   
```
cd web3.0/smart_contract
npm install
```  

Next, you will have to configure the `hardhat.config.js` file.    
You will need to first create a `hardhat.config.js` file in the `web3.0/smart_contract` folder    
A template file (`hardhat.config-template.js`) has already been provided and you can copy the file and rename it as `hardhat.config.js`

To configure the file, you will need to paste the private key of one of the Ethereum accounts provided by the Ganache server. This will be the Ethereum account that will be used to deploy the Smart Contract.    

Double check that the `url` entry in the js file is the RPC server address that Ganache is running on. 

Once all that is done, the Smart Contract can be deployed.    
In the `web3.0/smart_contract` folder on your terminal, run the following command:    
```
npx hardhat run .\scripts\deploy.js --network ganache
```

The terminal should output a line that says something like
```
Transactions deployed to: [CONTRACT DEPLOYED ADDRESS]
```   

This is the address that the Smart Contract is deployed at, copy this address to a notepad for now as it will be used later.

The generated ABIs will be in the following folders:
```
web3.0/artifacts/contracts/MarketTracker.sol/MarketTracker.json
web3.0/artifacts/contracts/MarketTracker.sol/Market.json
web3.0/artifacts/contracts/MarketTracker.sol/MarketTransactions.json
```

## Configuring and running the Decentralized Web App

Like in the previous section, you will first need to run `npm install` in the `web3.0/client` folder.   
```
cd web3.0/client`   
npm install
```

After all the npm dependencies have been installed, you will need to copy the generated ABIs in the previous step into the `web3.0/client/src/utils` folder. 

The last step to do before running the program, is changing the deployment address that you have copied earlier into `web3.0/client/src/utils/constants.js` file. 

In the `web3.0/client/src/utils/constants.js` file
```
line 8: export const contractAddress = '[CONTRACT DEPLOYED ADDRESS]';
```

## Running the program
From your terminal, cd into the `web3.0/client/` directory and run
```
npm run dev
```
___

## Libraries, Softwares and Frameworks used for this project

### Front-End Libraries and Technologies
1. ReactJS - https://reactjs.org/
2. Vite - https://vitejs.dev/
3. TailwindCSS - https://tailwindcss.com/
### Back-End Libraries and Technologies
1. Ganache - https://trufflesuite.com/ganache/
2. Hardhat - https://hardhat.org/
3. NodeJS - https://nodejs.org/en/