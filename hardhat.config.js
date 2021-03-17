require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

const accounts = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",

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
  defaultNetwork: "local",
  networks: {
    local: {
      url: `http://localhost:8545`,
      accounts,
      attachs:{
           cvnt: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
           store:"0x158d291D8b47F056751cfF47d1eEcd19FDF9B6f8",
           bridge:"0x2F54D1563963fC04770E85AF819c89Dc807f6a06",
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
    hecolocal:{
      url: `http://94.74.87.188:8545`,
      accounts,
      gasPrice: 0x3b9aca00,
      chainId: 3388,
      attachs:{
           cvnt: "0x3C15538ED063e688c8DF3d571Cb7a0062d2fB18D",
      }
    }
  }
};

 