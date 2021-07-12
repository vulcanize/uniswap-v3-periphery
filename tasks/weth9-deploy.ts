import { task } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';

task("weth9-deploy", "Deploys WETH9 contract")
  .setAction(async (args, hre) => {
    await hre.run("compile");
    const WETH9 = await hre.ethers.getContractFactory('WETH9');
    const weth9 = await WETH9.deploy()

    console.log("WETH9 deployed to:", weth9.address);
  });
