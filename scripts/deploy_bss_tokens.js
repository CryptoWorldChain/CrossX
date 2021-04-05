

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {

  const accounts = await ethers.getSigners();
  console.log("address:",accounts[0].address);
  const BSSToken = await hre.ethers.getContractFactory("BSSToken");
  const bss = await BSSToken.deploy();
  await bss.deployed();
  console.log("BSSToken deployed to:", bss.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
