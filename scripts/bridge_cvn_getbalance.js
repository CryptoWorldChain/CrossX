

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {


  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const CVNBridge = await hre.ethers.getContractFactory("CVNBridge");

  const bridge = await CVNBridge.attach(attachs.cvn_bridge);

  console.log("CVNBridge attached to:", bridge.address);
  
  const TaskStorage = await hre.ethers.getContractFactory("TaskStorage");
  const store = await TaskStorage.attach(attachs.cvn_storage);
  console.log("TaskStorage attach to:", store.address);

  const WCVN = await hre.ethers.getContractFactory("WCVN");
  const wcvn = await WCVN.attach(attachs.wcvn);
  console.log("WCVN attach to:", wcvn.address);

  console.log("WCVN WCVN.balance=%s,, CVN.balance=%s",(await wcvn.getBalanceOf(wcvn.address)).toString(10),
                              (await ethers.provider.getBalance(wcvn.address)).toString(10))
  


  console.log("store WCVN.balance=%s,, CVN.balance=%s",(await wcvn.getBalanceOf(store.address)).toString(10),
                              (await ethers.provider.getBalance(store.address)).toString(10))
  
  console.log("bridge WCVN.balance=%s,, CVN.balance=%s",(await wcvn.getBalanceOf(bridge.address)).toString(10),
    (await ethers.provider.getBalance(bridge.address)).toString(10))

  for(var i=0;i<accounts.length;i++){
    console.log("account[%d] WCVN.balance=%s, CVN.balance=%s",i,(await wcvn.getBalanceOf(accounts[i].address)).toString(10),
        (await ethers.provider.getBalance(accounts[i].address)).toString(10))
    // console.log("CVN.balance before:",);
  }

  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
