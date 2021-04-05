
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
 
  //  let web3 = new Web3(new web3adapter.Web3HTTPProviderAdapter(ethers.provider));
  // web3.provider = ethers.provider;
  for(var i=0;i<accounts.length;i++){
    // console.log("address:%s,balance=%s",accounts[i].address,(await web3.eth.getBalance(accounts[i].address)).toString(10));
    console.log("address:%d/%d,%s,balance=%s",i,accounts.length,accounts[i].address,(await ethers.provider.getBalance(accounts[i].address)).toString(10));
  }

  
  await accounts[0].sendTransaction({to:accounts[8].address,value:ethers.utils.parseUnits("100","wei")});
  console.log("send eth ok")
  console.log(" balance=%s",(await ethers.provider.getBalance(accounts[8].address)).toString(10));

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
