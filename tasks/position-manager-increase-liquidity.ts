import { task, types } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import { ContractTransaction } from "ethers";

task("position-manager-increase-liquidity", "Increases the amount of liquidity in a position")
    .addParam('positionManager', 'Address of Position Manager contract', undefined, types.string)
    .addParam('tokenId', 'The ID of the token for which liquidity is being increased', undefined, types.string)
    .addParam('amount0Desired', 'Amount 0 desired', undefined, types.int)
    .addParam('amount1Desired', 'Amount 1 desired', undefined, types.int)
    .addParam('amount0Min', 'Amount 0 minimum', undefined, types.int)
    .addParam('amount1Min', 'Amount 1 minimum', undefined, types.int)
    .addParam('deadline', 'Deadline timestamp', undefined, types.int)
    .setAction(async (args, hre) => {
        const {
            positionManager: positionManagerAddress,
            tokenId,
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            deadline
        } = args;

        await hre.run("compile");

        const PositionManager = await hre.ethers.getContractFactory('NonfungiblePositionManager');
        const positionManager = PositionManager.attach(positionManagerAddress);

        const transaction: ContractTransaction = await positionManager.increaseLiquidity({
            tokenId,
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            deadline
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
