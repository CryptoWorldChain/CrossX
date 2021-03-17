

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {


  const attachs =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  const TaskStorage = await hre.ethers.getContractFactory("TaskStorage");
  const store = await TaskStorage.deploy();
  await store.deployed();
  console.log("TaskStorage deployed to:", store.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
