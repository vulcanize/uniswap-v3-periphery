# Uniswap V3 Periphery

[![Tests](https://github.com/Uniswap/uniswap-v3-periphery/workflows/Tests/badge.svg)](https://github.com/Uniswap/uniswap-v3-periphery/actions?query=workflow%3ATests)
[![Lint](https://github.com/Uniswap/uniswap-v3-periphery/workflows/Lint/badge.svg)](https://github.com/Uniswap/uniswap-v3-periphery/actions?query=workflow%3ALint)

This repository contains the periphery smart contracts for the Uniswap V3 Protocol.
For the lower level core contracts, see the [uniswap-v3-core](https://github.com/Uniswap/uniswap-v3-core)
repository.

## Bug bounty

This repository is subject to the Uniswap V3 bug bounty program,
per the terms defined [here](./bug-bounty.md).

## Local deployment

In order to deploy this code to a local testnet, you should install the npm package
`@uniswap/v3-periphery`
and import bytecode imported from artifacts located at
`@uniswap/v3-periphery/artifacts/contracts/*/*.json`.
For example:

```typescript
import {
  abi as SWAP_ROUTER_ABI,
  bytecode as SWAP_ROUTER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'

// deploy the bytecode
```

This will ensure that you are testing against the same bytecode that is deployed to
mainnet and public testnets, and all Uniswap code will correctly interoperate with
your local deployment.

## Using solidity interfaces

The Uniswap v3 periphery interfaces are available for import into solidity smart contracts
via the npm artifact `@uniswap/v3-periphery`, e.g.:

```solidity
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract MyContract {
  ISwapRouter router;

  function doSomethingWithSwapRouter() {
    // router.exactInput(...);
  }
}

```

## Development

To test the contract in a private network.

```bash
# Run local hardhat node.
$ yarn hardhat node

# Deploy WETH9 token.
$ yarn weth9:deploy

# Deploy factory from uniswap package.
$ yarn factory:deploy

# Deploy NonfungiblePositionManager contract.
$ yarn position-manager:deploy --factory 0xFactoryAddress --weth9 0xWeth9Address

# In uniswap-v3-core deploy and initialize pool
# $ yarn pool:create --factory 0xFactoryAddress --token0 0xToken0Address --token1 0xToken1Address --fee 500
# $ yarn pool:initialize --sqrt-price 79228162514264337593543950336 --pool 0xPoolAddress

# Call PositionManager mint method.
# `deadline` should be a timestamp in the future. Use `date +%s` for current timestamp or `yarn eth:block` to get current block timestamp.
$ yarn position-manager:mint --amount0-desired 15 --amount1-desired 15 --amount0-min 0 --amount1-min 0 --recipient 0xRecipientAddress --position-manager 0xPositionManagerAddress --pool 0xPoolAddress --deadline 1626247176

# Call PositionManager increaseLiquidity method.
# Use `tokenId` from IncreaseLiquidity event when calling mint method.
$ yarn position-manager:increase-liquidity --amount0-min 0 --amount1-min 0 --position-manager 0xPositionManagerAddress --token-id 1 --amount0-desired 15 --amount1-desired 15 --deadline 1626248076

# Call PositionManager decreaseLiquidity method.
$ yarn position-manager:decrease-liquidity --amount0-min 0 --amount1-min 0 --position-manager 0xPositionManagerAddress --token-id 1 --liquidity 5 --deadline 1626256257

# Call PositionManager collect method.
$ yarn position-manager:collect --amount0-max 15 --amount1-max 15 --recipient 0xRecipientAddress --position-manager 0xPositionManagerAddress --token-id 1
```
