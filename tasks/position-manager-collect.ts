import { task, types } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import { ContractTransaction } from "ethers";

task("position-manager-collect", "Collects up to a maximum amount of fees owed to a specific position to the recipient")
  .addParam('positionManager', 'Address of Position Manager contract', undefined, types.string)
  .addParam('tokenId', 'The ID of the token for which liquidity is being increased', undefined, types.string)
  .addParam('recipient', 'Recipient address', undefined, types.string)
  .addParam('amount0Max', 'The maximum amount of token0 to collect', undefined, types.int)
  .addParam('amount1Max', 'The maximum amount of token1 to collect', undefined, types.int)
  .setAction(async (args, hre) => {
    const {
      positionManager: positionManagerAddress,
      tokenId,
      recipient,
      amount0Max,
      amount1Max,
    } = args;

    await hre.run("compile");

    const PositionManager = await hre.ethers.getContractFactory('NonfungiblePositionManager');
    const positionManager = PositionManager.attach(positionManagerAddress);

    const transaction: ContractTransaction = await positionManager.collect({
      tokenId,
      recipient,
      amount0Max,
      amount1Max
    })
    
    const receipt = await transaction.wait();

    if (receipt.events) {
      const collectEvent = receipt.events.find(el => el.event === 'Collect');
  
      if (collectEvent && collectEvent.args) {
        console.log('Collect Event');
        console.log('tokenId:', collectEvent.args.tokenId.toString());
        console.log('recipient:', collectEvent.args.recipient.toString());
        console.log('amount0:', collectEvent.args.amount0.toString());
        console.log('amount1:', collectEvent.args.amount1.toString());
      }
    }
  });
