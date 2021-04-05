

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {




  const attachs =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  const CVNBridge = await hre.ethers.getContractFactory("CVNBridge");

  const bridge = await CVNBridge.attach(attachs.cvn_bridge);

  console.log("CVNBridge attached to:", bridge.address);

  const TaskStorage = await hre.ethers.getContractFactory("TaskStorage");
  const store = await TaskStorage.attach(attachs.cvn_storage);
  console.log("TaskStorage attach to:", store.address);

  console.log("TaskStorage caller is:", await store.caller());
  await store.changeCaller(bridge.address);

  console.log("TaskStorage caller to:", await  store.caller());
  // await bridge.change

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
