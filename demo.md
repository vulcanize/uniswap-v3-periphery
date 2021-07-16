# Demo

## Steps

```bash
# Pre-requisite: Reset databases and intialize servers.

# In uniswap-v3-periphery.
# Deploy factory from uniswap package.
$ yarn factory:deploy


# In watcher-ts/packages/uni-watcher.
# Watch Factory contract.
$ yarn watch:contract --startingBlock 100 --kind factory --address 0xFactoryAddress


# In uniswap-v3-core.
# Deploy 2 tokens using:
$ yarn token:deploy

# Create pool.
$ yarn pool:create --factory 0xFactoryAddress --token0 0xToken0Address --token1 0xToken1Address --fee 500

# Initialize pool.
$ yarn pool:initialize --sqrt-price 79228162514264337593543950336 --pool 0xPoolAddress


# In uniswap-v3-periphery
# Deploy WETH9 token.
$ yarn weth9:deploy

# Deploy NonfungiblePositionManager contract.
$ yarn position-manager:deploy --factory 0xFactoryAddress --weth9 0xWeth9Address


# In watcher-ts/packages/uni-watcher.
# Watch NonfungiblePositionManager contract.
$ yarn watch:contract --startingBlock 100 --kind nfpm --address 0xPositionManagerAddress


# In uniswap-v3-periphery
# Call PositionManager mint method.
# `deadline` should be a timestamp in the future. Use `date +%s` for current timestamp or `yarn eth:block` to get current block timestamp.
$ yarn position-manager:mint --amount0-desired 15 --amount1-desired 15 --amount0-min 0 --amount1-min 0 --recipient 0xRecipientAddress --position-manager 0xPositionManagerAddress --pool 0xPoolAddress --deadline 1634367993

# Call PositionManager increaseLiquidity method.
# Use `tokenId` from IncreaseLiquidity event when calling mint method.
$ yarn position-manager:increase-liquidity --amount0-min 0 --amount1-min 0 --position-manager 0xPositionManagerAddress --token-id 1 --amount0-desired 15 --amount1-desired 15 --deadline 1634367993

# Call PositionManager decreaseLiquidity method.
$ yarn position-manager:decrease-liquidity --amount0-min 0 --amount1-min 0 --position-manager 0xPositionManagerAddress --token-id 1 --liquidity 5 --deadline 1634367993

# Call PositionManager collect method.
$ yarn position-manager:collect --recipient 0xRecipientAddress --amount0-max 15 --amount1-max 15 --position-manager 0xPositionManagerAddress --token-id 1
```

## GraphQL Subscription

```graphql
subscription {
  onEvent {
    block {
      hash
      number
      timestamp
    }
    tx {
      hash
    }
    contract
    eventIndex
    event {
      __typename
      ... on TransferEvent {
        from
        to
        tokenId
      }
      ... on PoolCreatedEvent {
        token0
        token1
        fee
        tickSpacing
        pool
      }
      ... on InitializeEvent {
        sqrtPriceX96
        tick
      }
      ... on MintEvent {
        sender
        owner
        tickLower
        tickUpper
        amount
        amount0
        amount1
      }
      ... on BurnEvent {
        owner
        tickLower
        tickUpper
        amount
        amount0
        amount1
      }
      ... on SwapEvent {
        sender
        recipient
        amount0
        amount1
        sqrtPriceX96
        liquidity
        tick
      }
      ... on IncreaseLiquidityEvent {
        tokenId
        amount0
        amount1
        liquidity
      }
      ... on DecreaseLiquidityEvent {
        tokenId
        amount0
        amount1
        liquidity
      }
      ... on CollectEvent {
        tokenId
        amount0
        amount1
        recipient
      }
    }
    proof {
      data
    }
  }
}
```
