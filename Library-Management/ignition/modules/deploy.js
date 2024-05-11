const { ethers } = require("hardhat");

const main = async () => {
  const Library = await ethers.getContractFactory("Library");
  const contract = await Library.deploy(); // Note: Use Library.deploy() directly
  await contract.deployed(); // Wait for the deployment transaction to be mined
  console.log("Hello world");
  console.log(`Contract deployed to ${contract.address}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runMain();
