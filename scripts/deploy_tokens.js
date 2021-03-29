

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {

  const accounts = await ethers.getSigners();
  console.log("address:",accounts[0].address);
  console.log("provider:"+JSON.stringify(ethers.provider));
  const CVNToken = await hre.ethers.getContractFactory("CVNToken");
  const cvnt = await CVNToken.deploy();
  await cvnt.deployed();
  console.log("CVNT deployed to:", cvnt.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
