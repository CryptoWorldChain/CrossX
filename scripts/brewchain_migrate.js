
// import { extendEnvironment, subtask } from "hardhat/config";
const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

async function main() {

  // console.log("accounts",JSON.stringify(await newprovider.request({ method: "eth_getAccounts", params: [] })));
  const accounts = await ethers.getSigners();

  console.log("address:",accounts[0].address);
 
  // for(var i=0;i<accounts.length;i++){
    // console.log("address:%s,balance=%s",accounts[i].address,(await web3.eth.getBalance(accounts[i].address)).toString(10));
    // console.log("address:%d/%d,%s,balance=%s",i,accounts.length,accounts[i].address,(await ethers.provider.getBalance(accounts[i].address)).toString(10));
  // }

  const CVNToken = await hre.ethers.getContractFactory("CVNToken");


  var provider = ethers.provider;
    
  var blockNumber = await provider.getBlockNumber();
  console.log("blockNumber=",blockNumber);
  // hre.ethers.transfer("0x8DCdad0Fc090a25D58e87B1caE34058BfFf3f0c9",web3.utils.toWei('1000','ether'))
  // const web3 = new Web3( hre.network.provider )

  // hre.ethers.transfer("0x8DCdad0Fc090a25D58e87B1caE34058BfFf3f0c9",web3.utils.toWei('1000','ether'))
  // await web3.eth.sendTransaction({
  //   from: accounts[0].address,
  //   to: '0x8DCdad0Fc090a25D58e87B1caE34058BfFf3f0c9',
  //   value: web3.utils.toWei('1000','ether')
  // });


  // console.log("vcvnt after connect:",CVNToken.connect)
  // const cvnt = await CVNToken.deploy();
  
  // await cvnt.deployed();
  // console.log("cvnt="+JSON.stringify(cvnt))
  const cvnt = await CVNToken.attach("0x075fA587463711535d1619b89fc0e26EF5f4A30b");
  // console.log("CVNT deployed to:", cvnt.address);
  // hre.ethers.provider = newprovider; 
  // hre.network.provider = newprovider;
  // cvnt.signer = newsigner;git
  await cvnt.addMinter(accounts[0].address);
  await cvnt.addMinter(accounts[1].address);

  console.log("add minter ok");
  
  // console.log("cvnt."+JSON.stringify(cvnt));

  console.log("CVNT miner length=:",(await cvnt.getMinterLength()).toString(10));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
