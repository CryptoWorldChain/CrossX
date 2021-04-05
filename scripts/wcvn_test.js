

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {


  const attachs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();

  const WCVN = await hre.ethers.getContractFactory("WCVN");
  const wcvn = await WCVN.deploy();
  await wcvn.deployed();
  console.log("WCVN deployed to:", wcvn.address);

  var amount = ethers.utils.parseUnits("100","wei")

  var receiver = accounts[0].address;

  // console.log("wcvn.balance deposit.before:",(await wcvn.getBalanceOf(receiver)).toString(10));
  // console.log("CVN.balance deposit.before:",(await ethers.provider.getBalance(receiver)).toString(10));

  await wcvn.deposit({value:amount});
  // console.log("wcvn.balance deposit.after:",(await wcvn.getBalanceOf(receiver)).toString(10));
  // console.log("CVN.balance deposit.after:",(await ethers.provider.getBalance(receiver)).toString(10));


  console.log("start to withdraw");

  await wcvn.withdraw(amount);
  // console.log("wcvn.balance withdraw.after:",(await wcvn.getBalanceOf(receiver)).toString(10));
  // console.log("CVN.balance withdraw.after:",(await ethers.provider.getBalance(receiver)).toString(10));



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
