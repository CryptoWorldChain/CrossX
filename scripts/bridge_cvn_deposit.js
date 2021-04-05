

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');


async function main() {


  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const CVNBridge = await hre.ethers.getContractFactory("CVNBridge");

  const bridge = await CVNBridge.attach(attachs.cvn_bridge);

   console.log("CVNBridge attached to:", bridge.address);

  const WCVN = await hre.ethers.getContractFactory("WCVN");
  const wcvn = await WCVN.attach(attachs.wcvn);
  console.log("WCVN attached to:", wcvn.address);
  var receiver = accounts[1].address;
  var amount = ethers.utils.parseUnits("1000","wei")

  var txid= ethers.utils.keccak256(Date.now())
  var tx  = await bridge.depositNative(receiver,amount,txid,{value:amount});

  console.log("submit task txid=",txid);
  var taskhash = await bridge.getDepositTaskHash(accounts[0].address,receiver,amount,txid);
  console.log("txhash=",taskhash);
  console.log("txstatus=",await bridge.getTaskStatus(taskhash));
  // await web3.eth.getTransactionReceipt(tx.hash).then(console.log);
  

  // console.log("taskhash:",result);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
