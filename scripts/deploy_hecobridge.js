

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {

  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const HecoBridge = await hre.ethers.getContractFactory("HecoBridge");
  

  const bridge = await HecoBridge.deploy(attachs.store,attachs.cvnt);
  await bridge.deployed();
  console.log("HecoBridge deployed to:", bridge.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
