

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {

  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const CVNBridge = await hre.ethers.getContractFactory("CVNBridge");
  // console.log("attachs=",attachs)
  const bridge = await CVNBridge.deploy(attachs.cvn_storage,attachs.wcvn,attachs.fee,0);
  await bridge.deployed();
  console.log("CVNBridge deployed to:", bridge.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
