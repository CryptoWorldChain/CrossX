

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {


  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const HecoBridge = await hre.ethers.getContractFactory("HecoBridge");

  const bridge = await HecoBridge.attach(attachs.bridge);

  console.log("HecoBridge attached to:", bridge.address);
  
  const TaskStorage = await hre.ethers.getContractFactory("TaskStorage");
  const store = await TaskStorage.attach(attachs.store);
  console.log("TaskStorage attach to:", store.address);

  var receiver = accounts[1].address;
  var amount = web3.utils.toWei('1000','wei');

  // var taskHash = "0x6bbe1ecac5982860b91ce2518e63bde0d55690e25d1b9d2142fac28df74da9b3";
  var txid="0x6896dfd6539e6965400eb087418b7b84807e0ff1132636f449b60e56e14507d0";
  // console.log("taskinfo=",await store.getTask(taskHash));
  var taskHash = await bridge.getDepositTaskHash(accounts[0].address,receiver,amount,txid);
  console.log("txhash=",taskHash);


  var status;
  console.log("taskstatus=",await store.getTaskStatus(taskHash));
  for(var i=0;i<5;i++){
    if(await store.getTaskStatus(taskHash)<2){
      status = await bridge.connect(accounts[i]).voteDepositTask(accounts[0].address,receiver,amount,txid);
    }
  }
  console.log("after vote taskstatus:",await store.getTaskStatus(taskHash));

  
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
