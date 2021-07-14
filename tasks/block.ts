import { task } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';

task(
  "block",
  "Prints the current block info",
  async (_, { ethers }) => {
    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber)

    console.log("Current block number: " + blockNumber);
    console.log("Block info: ", block);
  }
);
