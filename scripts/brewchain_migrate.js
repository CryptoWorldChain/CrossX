
// import { extendEnvironment, subtask } from "hardhat/config";
const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
// require("web3")
// var web3adapter = require("@nomiclabs/hardhat-web3/web3-provider-adapter");


async function main() {

  // console.log("accounts",JSON.stringify(await newprovider.request({ method: "eth_getAccounts", params: [] })));
  const accounts = await ethers.getSigners();

  console.log("address:",accounts[0].address);

  const CVNToken = await hre.ethers.getContractFactory("CVNToken");

  var provider = ethers.provider;
    
  var blockNumber = await provider.getBlockNumber();
  console.log("blockNumber=",blockNumber);


  const cvnt = await CVNToken.attach("0x075fA587463711535d1619b89fc0e26EF5f4A30b");
  // console.log("CVNT deployed to:", cvnt.address);
  // hre.ethers.provider = newprovider; 
  // hre.network.provider = newprovider;
  // cvnt.signer = newsigner;git
  await cvnt.connect(accounts[3]).addMinter(accounts[0].address);
  console.log("CVNT miner length=:",(await cvnt.getMinterLength()).toString(10));

  await cvnt.addMinter(accounts[1].address);

  console.log("CVNT miner length=:",(await cvnt.getMinterLength()).toString(10));
  console.log("add minter ok");
  
  // console.log("cvnt."+JSON.stringify(cvnt));

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
