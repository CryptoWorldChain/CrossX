

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {


  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();

  const CVNToken = await hre.ethers.getContractFactory("CVNToken");
  const cvnt = await CVNToken.attach(attachs.cvnt);
  console.log("CVNT attatch to:", cvnt.address);



  const HecoBridge = await hre.ethers.getContractFactory("HecoBridge");

  const bridge = await HecoBridge.attach(attachs.bridge);

  console.log("HecoBridge attached to:", bridge.address);
  
  const TaskStorage = await hre.ethers.getContractFactory("TaskStorage");
  const store = await TaskStorage.attach(attachs.store);
  console.log("TaskStorage attach to:", store.address);

  var receiver = accounts[1].address;
  var amount = web3.utils.toWei('1000','wei');

  // var taskHash = "0x6bbe1ecac5982860b91ce2518e63bde0d55690e25d1b9d2142fac28df74da9b3";
  // var txid="0xbcc031ee251ccc9745defa0bfb45db7f6cbe43e00a6504062359bff90e92937a";
  var txid="0x6aaab5178cbbb13924de4695482ee2777b571e8720544913195b0fa788895bec";//web3.utils.soliditySha3(Date.now());
    console.log("txid=",txid);
  // console.log("taskinfo=",await store.getTask(taskHash));
  var taskHash = await bridge.getWithdrawTaskHash(accounts[0].address,receiver,amount,txid);

  console.log("txhash=",taskHash);

  console.log("taskstatus=",await store.getTaskStatus(taskHash));
  for(var i=0;i<5;i++){
    if(await store.getTaskStatus(taskHash)<2){
       await bridge.connect(accounts[i]).approveWithdrawTask(accounts[0].address,receiver,amount,txid);
    }
  }

  console.log("after vote taskstatus:",await store.getTaskStatus(taskHash));
  console.log("balance before:",(await cvnt.balanceOf(receiver)).toString(10));

  await bridge.withdrawTokenByHash(taskHash);
  console.log("balance after:",(await cvnt.balanceOf(receiver)).toString(10));
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
