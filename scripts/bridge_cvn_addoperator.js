

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

  for(var i=0;i<5;i++)
  {
    await bridge.addOperator(accounts[i].address);
  }

  await bridge.changeVoteNum(3);

  console.log("change CVNBridge voteNum:",await bridge.voteNum());

  console.log(" CVNBridge operator count:",(await bridge.operatorCount()).toString(10));

for(var i=0;i<10;i++)
  {
    // await bridge.addOperator(accounts[i].address);
      console.log(" CVNBridge is operator["+accounts[i].address+"]:",(await bridge.isOperator(accounts[i].address)));
  }



  // console.log(" CVNBridge is operator:",(await bridge.isOperator(accounts[9].address)));
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
