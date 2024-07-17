const hre = require("hardhat");

async function main() {
  const Library = await hre.ethers.getContractFactory("Library");
  const library = await Library.deploy();
  await library.deployed();

  console.log(`Library contract deployed to ${library.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});