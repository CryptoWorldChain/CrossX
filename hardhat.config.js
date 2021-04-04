require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");

require("@nomiclabs/hardhat-etherscan");
require("brewchain_provider");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

const accounts = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
  // initialIndex: 8
  // accountsBalance: "990000000000000000000",
}

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey:"6IQTZTMD392X2U2SYZBABWDS8KB6D8UD4T"
  },
  defaultNetwork: "brewchain",
  networks: {
    local: {
      url: `http://localhost:8545`,
      accounts,
      attachs:{
           cvnt: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
           store:"0xBbc18b580256A82dC0F9A86152b8B22E7C1C8005",
           bridge:"0xB9d9e972100a1dD01cd441774b45b5821e136043",
         }
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    heco:{
      url: `https://http-mainnet.hecochain.com`,
      accounts,
      gasPrice: 20*1000000000,
      chainId: 128,
      loggingEnabled: true,
      blockGasLimit:0x280de80,
      attachs:{
        cvnt: "0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D",
      },
    },
    brewchain:{
      url:"http://localhost:8000",
      accounts,
      gasPrice: 20*1000000000,
      chainId: 128,
      loggingEnabled: true,
      blockGasLimit:0x280de80,
      attachs:{
        cvnt: "0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D",
      },
    },
    hecolocal:{
      url: `http://94.74.87.188:8545`,
      accounts,
      gasPrice: 0x3b9aca00,
      chainId: 0xd3c,
      attachs:{
           cvnt: "0x139e1D41943ee15dDe4DF876f9d0E7F85e26660A",
           store:"0x67aD6EA566BA6B0fC52e97Bc25CE46120fdAc04c",
           bridge:"0x114e375B6FCC6d6fCb68c7A1d407E652C54F25FB",


      }
    }
  }
};

 