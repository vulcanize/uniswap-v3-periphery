import 'hardhat-typechain'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-watcher'

import './tasks/block'
import './tasks/weth9-deploy'
import './tasks/factory-deploy'
import './tasks/position-manager-deploy'
import './tasks/position-manager-mint'
import './tasks/position-manager-increase-liquidity'
import './tasks/position-manager-decrease-liquidity'
import './tasks/position-manager-collect'

const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const DEBUG_COMPILER_SETTINGS = {
  ...DEFAULT_COMPILER_SETTINGS,
  settings: {
    ...DEFAULT_COMPILER_SETTINGS.settings,
    optimizer: {
      enabled: false,
      // https://github.com/ethereum/solidity/issues/10354#issuecomment-847407103
      details: {
        yul: true,
        yulDetails: {
          stackAllocation: true,
        },
      }
    },
    outputSelection: {
      '*': {
        '*': [
          'abi', 'storageLayout',
          'metadata', 'evm.bytecode', // Enable the metadata and bytecode outputs of every single contract.
          'evm.bytecode.sourceMap' // Enable the source map output of every single contract.
        ],
        '': [
          'ast' // Enable the AST output of every single file.
        ]
      }
    }
  },
}

const WETH9_COMPILER_SETTINGS = {
  // Use DEBUG_COMPILER_SETTINGS in development.
  // ...DEBUG_COMPILER_SETTINGS,
  ...DEFAULT_COMPILER_SETTINGS,
  version: '0.5.0'
}

export default {
  networks: {
    hardhat: {
      // Need to set to true when optimizer is not set.
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrum: {
      url: `http://localhost:8547`,
      gas: 8000000,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      // Use DEBUG_COMPILER_SETTINGS in development.
      // DEBUG_COMPILER_SETTINGS,
      DEFAULT_COMPILER_SETTINGS,
      WETH9_COMPILER_SETTINGS
    ],
    overrides: {
      // Comment override settings to debug in development.
      'contracts/NonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/MockTimeNonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/NFTDescriptorTest.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/NonfungibleTokenPositionDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/libraries/NFTDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
}
