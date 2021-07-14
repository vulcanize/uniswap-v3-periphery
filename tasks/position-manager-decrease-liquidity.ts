import { task, types } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import { ContractTransaction } from "ethers";

task("position-manager-decrease-liquidity", "Decreases the amount of liquidity in a position")
  .addParam('positionManager', 'Address of Position Manager contract', undefined, types.string)
  .addParam('tokenId', 'The ID of the token for which liquidity is being increased', undefined, types.string)
  .addParam('liquidity', 'Liquidity amount', undefined, types.int)
  .addParam('amount0Min', 'Amount 0 minimum', undefined, types.int)
  .addParam('amount1Min', 'Amount 1 minimum', undefined, types.int)
  .addParam('deadline', 'Deadline timestamp', undefined, types.int)
  .setAction(async (args, hre) => {
    const {
      positionManager: positionManagerAddress,
      tokenId,
      liquidity,
      amount0Min,
      amount1Min,
      deadline
    } = args;

    await hre.run("compile");

    const PositionManager = await hre.ethers.getContractFactory('NonfungiblePositionManager');
    const positionManager = PositionManager.attach(positionManagerAddress);

    const transaction: ContractTransaction = await positionManager.decreaseLiquidity({
      tokenId,
      liquidity,
      amount0Min,
      amount1Min,
      deadline
    })
    
    const receipt = await transaction.wait();

    if (receipt.events) {
      const decreaseLiquidityEvent = receipt.events.find(el => el.event === 'DecreaseLiquidity');
  
      if (decreaseLiquidityEvent && decreaseLiquidityEvent.args) {
        console.log('DecreaseLiquidity Event');
        console.log('tokenId:', decreaseLiquidityEvent.args.tokenId.toString());
        console.log('liquidity:', decreaseLiquidityEvent.args.liquidity.toString());
        console.log('amount0:', decreaseLiquidityEvent.args.amount0.toString());
        console.log('amount1:', decreaseLiquidityEvent.args.amount1.toString());
      }
    }
  });
