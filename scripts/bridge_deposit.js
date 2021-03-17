

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

  const CVNToken = await hre.ethers.getContractFactory("CVNToken");
  const cvnt = await CVNToken.attach(attachs.cvnt);
  console.log("CVNT attached to:", cvnt.address);
  var receiver = accounts[1].address;

  
  await cvnt.approve(bridge.address,web3.utils.toWei('1000','ether'));

  var amount = web3.utils.toWei('1000','wei')
  var txid=web3.utils.soliditySha3(Date.now());
  var tx  = await bridge.deposit(receiver,amount,txid);
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
