

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');



async function main() {


 
  const attachs =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  const TaskStorage = await hre.ethers.getContractFactory("TaskStorage");
  const store = await TaskStorage.deploy();
  await store.deployed();
  console.log("TaskStorage deployed to:", store.address);

  
  const HecoBridge = await hre.ethers.getContractFactory("HecoBridge");
  

  const bridge = await HecoBridge.deploy(store.address,attachs.cvnt,accounts[0].address,web3.utils.toWei('0.1','ether'));
  await bridge.deployed();
  console.log("HecoBridge deployed to:", bridge.address);

  console.log("TaskStorage caller is:", await store.caller());
  await store.changeCaller(bridge.address);
  console.log("TaskStorage caller to:", await  store.caller());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
