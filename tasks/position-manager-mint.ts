import { task, types } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import { constants, ContractTransaction } from "ethers";
import {
    abi as POOL_ABI,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'

import { getMaxTick, getMinTick } from '../test/shared/ticks';

task("position-manager-mint", "Creates a new position wrapped in a NFT")
  .addParam('positionManager', 'Address of Position Manager contract', undefined, types.string)
  .addParam('pool', 'Address of the Pool', undefined, types.string)
  .addParam('amount0Desired', 'Amount 0 desired', undefined, types.int)
  .addParam('amount1Desired', 'Amount 1 desired', undefined, types.int)
  .addParam('amount0Min', 'Amount 0 minimum', undefined, types.int)
  .addParam('amount1Min', 'Amount 1 minimum', undefined, types.int)
  .addParam('recipient', 'Recipient address', undefined, types.string)
  .addParam('deadline', 'Deadline timestamp', undefined, types.int)
  .setAction(async (args, hre) => {
    const {
      positionManager: positionManagerAddress,
      pool: poolAddress,
      amount0Desired,
      amount1Desired,
      amount0Min,
      amount1Min,
      recipient,
      deadline
    } = args;

    await hre.run("compile");
    
    const pool = await hre.ethers.getContractAt(POOL_ABI, poolAddress);
    const token0Address = await pool.token0();
    const token1Address = await pool.token1();
    const tickSpacing = await pool.tickSpacing();
    const fee = await pool.fee()

    const PositionManager = await hre.ethers.getContractFactory('NonfungiblePositionManager');
    const positionManager = PositionManager.attach(positionManagerAddress);
    
    const token0 = await hre.ethers.getContractAt('TestERC20', token0Address);
    const token1 = await hre.ethers.getContractAt('TestERC20', token1Address);
    
    // https://github.com/Uniswap/uniswap-v3-periphery/blob/main/test/NonfungiblePositionManager.spec.ts#L44
    const transactions: ContractTransaction[] = await Promise.all([
      token0.approve(positionManager.address, constants.MaxUint256),
      token1.approve(positionManager.address, constants.MaxUint256)
    ]);

    await Promise.all(transactions.map(tx => tx.wait()))

    const transaction: ContractTransaction = await positionManager.mint({
      token0: token0Address,
      token1: token1Address,
      tickLower: getMinTick(tickSpacing),
      tickUpper: getMaxTick(tickSpacing),
      amount0Desired,
      amount1Desired,
      amount0Min,
      amount1Min,
      recipient,
      deadline,
      fee
    })
    
    const receipt = await transaction.wait();

    if (receipt.events) {
      const increaseLiquidityEvent = receipt.events.find(el => el.event === 'IncreaseLiquidity');
  
      if (increaseLiquidityEvent && increaseLiquidityEvent.args) {
        console.log('IncreaseLiquidity Event');
        console.log('tokenId:', increaseLiquidityEvent.args.tokenId.toString());
        console.log('liquidity:', increaseLiquidityEvent.args.liquidity.toString());
        console.log('amount0:', increaseLiquidityEvent.args.amount0.toString());
        console.log('amount1:', increaseLiquidityEvent.args.amount1.toString());
      }
    }
  });
