import { task, types } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';

task("position-manager-deploy", "Deploys NonfungiblePositionManager contract")
  .addParam('factory', 'Address of Factory contract', undefined, types.string)
  .addParam('weth9', 'Address of WETH9 contract', undefined, types.string)
  .setAction(async (args, hre) => {
    const { factory, weth9 } = args;
    await hre.run("compile");

    // https://github.com/Uniswap/uniswap-v3-periphery/blob/main/test/shared/completeFixture.ts#L31
    const nftDescriptorLibraryFactory = await hre.ethers.getContractFactory('NFTDescriptor')
    const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy()
    
    const positionDescriptorFactory = await hre.ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
      libraries: {
        NFTDescriptor: nftDescriptorLibrary.address,
      },
    })

    const nftDescriptor = await positionDescriptorFactory.deploy(weth9)

    const positionManagerFactory = await hre.ethers.getContractFactory('NonfungiblePositionManager');
    const positionManager = await positionManagerFactory.deploy(factory, weth9, nftDescriptor.address);

    console.log('NonfungiblePositionManager deployed to:', positionManager.address);
  });
