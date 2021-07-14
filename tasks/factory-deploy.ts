import { task } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';

import {
  abi as FACTORY_ABI,
  bytecode as FACTORY_BYTECODE,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'

task(
  "factory-deploy",
  "Deploys Factory contract from uniswap package",
  async (_, { ethers }) => {
    const [signer] = await ethers.getSigners();
    const Factory  = new ethers.ContractFactory(FACTORY_ABI, FACTORY_BYTECODE, signer);
    const factory = await Factory.deploy()

    console.log("Factory deployed to:", factory.address);
  }
);
