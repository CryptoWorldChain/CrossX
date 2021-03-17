

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const web3 = require('web3');





async function main() {
  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const CVNToken = await hre.ethers.getContractFactory("CVNToken");
  const cvnt = await CVNToken.attach(attachs.cvnt);
  console.log("CVNT attatch to:", cvnt.address);
  var receiver = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92268";

  await cvnt.transfer(receiver,web3.utils.toWei('1000','ether'));
  var balance = await cvnt.balanceOf(receiver);
  console.log("address balance :",balance.toString(10));


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
