

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

  var receiver = accounts[1].address;
  var amount = ethers.utils.parseUnits("1000","wei")

  // var taskHash = "0x6bbe1ecac5982860b91ce2518e63bde0d55690e25d1b9d2142fac28df74da9b3";
  var txid="0xc0b59688fcbaf29b4fa63ef0250bc649d11b63e2b310306d6a276902f57e2c23";
  // console.log("taskinfo=",await store.getTask(taskHash));
  var taskHash = await bridge.getDepositTaskHash(accounts[0].address,receiver,amount,txid);
  console.log("txhash=",taskHash);

  var status;
  console.log("taskstatus=",await bridge.getTaskStatus(taskHash));
  for(var i=0;i<5;i++){
    status = await bridge.getTaskStatus(taskHash);
    if(status<2){
      status = await bridge.connect(accounts[i]).voteDepositTask(accounts[0].address,receiver,amount,txid);
    }
    console.log("get status = "+JSON.stringify(status))
  }
  console.log("after vote taskstatus:",await bridge.getTaskStatus(taskHash));

  
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
