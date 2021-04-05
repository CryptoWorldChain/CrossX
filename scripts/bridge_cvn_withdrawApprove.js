

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {


  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();

  const WCVN = await hre.ethers.getContractFactory("WCVN");
  const wcvn = await WCVN.attach(attachs.wcvn);
  console.log("WCVN attatch to:", wcvn.address);



  const CVNBridge = await hre.ethers.getContractFactory("CVNBridge");

  const bridge = await CVNBridge.attach(attachs.cvn_bridge);

  console.log("CVNBridge attached to:", bridge.address);
  
  const TaskStorage = await hre.ethers.getContractFactory("TaskStorage");
  const store = await TaskStorage.attach(attachs.cvn_storage);
  console.log("TaskStorage attach to:", store.address);

  var receiver = accounts[12].address;
  var amount = web3.utils.toWei('10','wei');

  // var taskHash = "0x6bbe1ecac5982860b91ce2518e63bde0d55690e25d1b9d2142fac28df74da9b3";
  // var txid="0xbcc031ee251ccc9745defa0bfb45db7f6cbe43e00a6504062359bff90e92937a";
  var txid=ethers.utils.keccak256(Date.now());//"0x6aaab5178cbbb13924de4695482ee2777b571e8720544913195b0fa788895bec";//web3.utils.soliditySha3(Date.now());
    // console.log("txid=",txid);
  // // console.log("taskinfo=",await store.getTask(taskHash));
  var taskHash = await bridge.getWithdrawTaskHash(accounts[0].address,receiver,amount,txid);

  console.log("txhash=",taskHash);

  // console.log("taskstatus=",await store.getTaskStatus(taskHash));
  for(var i=0;i<5;i++){
    // if(await store.getTaskStatus(taskHash)<2){
       await bridge.connect(accounts[i]).approveWithdrawTask(accounts[0].address,receiver,amount,txid);
    // }
    var status = await store.getTaskStatus(taskHash);
    console.log("vote status="+status);
    if(status>=2){
        break;
    }
  }

  // var taskHash = "0x1ba7ed51ef619e97ccd97bd1442ab12f8cef4eee2f8cd21ac0606752729a3974";
  console.log("after vote taskstatus:",await store.getTaskStatus(taskHash));
  console.log("wcvn.balance before:",(await wcvn.getBalanceOf(receiver)).toString(10));
  console.log("CVN.balance before:",(await ethers.provider.getBalance(receiver)).toString(10));
  await bridge.withdrawNativeByHash(taskHash);

  console.log("after withdraw taskstatus:",await store.getTaskStatus(taskHash));
  console.log("balance after:",(await wcvn.getBalanceOf(receiver)).toString(10));
  console.log("CVN.balance after:",(await ethers.provider.getBalance(receiver)).toString(10));
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
