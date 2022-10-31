//To use this configuration file, remove "-template" from file name so it becomes hardhat.config-template.js
//I will not be committing my own configuration file as it contains my own ethereum private key. This template is what I use but without the private key.

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: { 
    version: "0.8.0", 
    settings: { 
      optimizer: { 
        enabled: true, 
        runs: 1 
      } 
    }
  },
  networks:{
    ganache: {
      url: 'HTTP://127.0.0.1:7545',
      chainId: 1337,
      accounts: ['YOUR PRIVATE KEY']
    }
  }
};
