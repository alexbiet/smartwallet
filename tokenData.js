const db = {
    rinkeby: {
      ETH: {
       id: "ETH",
       name: "Ethereum",       
       decimals: 18, 
       contractAddress: "0xd74047010D77c5901df5b0f9ca518aED56C85e8D", //
       aTokenAddress: "0x608D11E704baFb68CfEB154bF7Fd641120e33aD4", //aEthWETH 
          },
     WBTC: {
       id:"WBTC",
       name: "Wrapped BTC",
       contractAddress: "0x124F70a8a3246F177b0067F435f5691Ee4e467DD",
       decimals: 8, 
       aTokenAddress: "0xeC1d8303b8fa33afB59012Fc3b49458B57883326",
  
     },
     DAI: {
     id: "DAI",
     name: "DAI",
     contractAddress: "0x4aAded56bd7c69861E8654719195fCA9C670EB45",
     decimals: 18, 
     aTokenAddress: "0x49866611AA7Dc30130Ac6A0DF29217D16FD87bc0",
   },
    USDC: {
      id: "USDC",
      name: "USDC",
      contractAddress: "0xb18d016cDD2d9439A19f15633005A6b2cd6Aa774",
      decimals: 6,
    },
    AAVE: {
      id: "AAVE",
      name: "AAVE",
      contractAddress: "0x100aB78E5A565a94f2a191714A7a1B727268eFFb",
      decimals: 18,
    },
    LINK: {
      id: "LINK",
      name: "ChainLink",
      decimals: 18,
      contractAddress: "0x237f409fBD10E30e237d63d9050Ae302e339028E",
    },
     Contracts: {
       AaveOracle: "0xA323726989db5708B19EAd4A494dDe09F3cEcc69",
       WETHGateway: "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe",
       PoolAddressProvider: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
       ProtocolDataProvider: "0xBAB2E7afF5acea53a43aEeBa2BA6298D8056DcE5",
       ERC20Faucet: "0x88138CA1e9E485A1E688b030F85Bb79d63f156BA",
     }
     },

   polygon: {
     ETH: {
       id: "MATIC",
       name: "MATIC",
       decimals: 18,
       contractAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", //WrappedMATIC
       aTokenAddress:  "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97", //aPolWMATIC
 
     },
     WETH: {
      id: "WETH",
      name: "Wrapped ETH",
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18, 
      aTokenAddress: "0x608D11E704baFb68CfEB154bF7Fd641120e33aD4",
    },
    WBTC: {
      id:"WBTC",
      name: "Wrapped BTC",
      contractAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      decimals: 8, 
      aTokenAddress: "0xeC1d8303b8fa33afB59012Fc3b49458B57883326",
    },
    DAI: {
    id: "DAI",
    name: "DAI",
    contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    decimals: 18, 
    aTokenAddress: "0x49866611AA7Dc30130Ac6A0DF29217D16FD87bc0",
  },
    USDC: {
    id: "USDC",
    name: "USDC",
    contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
  },
  AAVE: {
    id: "AAVE",
    name: "AAVE",
    contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    decimals: 18,
  },
  LINK: {
    id: "LINK",
    name: "ChainLink",
    decimals: 18,
    contractAddress: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
  },
   Contracts: {
     AaveOracle: "0xb023e699F5a33916Ea823A16485e259257cA8Bd1",
     WETHGateway: "0x9bdb5fcc80a49640c7872ac089cc0e00a98451b6",
     PoolAddressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
     ProtocolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
 
   },
   },
   mumbai: {
     ETH: {
       id: "MATIC",
       name: "MATIC",
       decimals: 18,
       contractAddress: "0xb685400156cF3CBE8725958DeAA61436727A30c3",
       aTokenAddress: "0x89a6AE840b3F8f489418933A220315eeA36d11fF", 
 
     },
     WETH: {
      id: "WETH",
      name: "Wrapped ETH",
      contractAddress: "0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323",
      decimals: 18, 
      aTokenAddress: "0x685bF4eab23993E94b4CFb9383599c926B66cF57",
    },
    WBTC: {
      id:"WBTC",
      name: "Wrapped BTC",
      contractAddress: "0x85E44420b6137bbc75a85CAB5c9A3371af976FdE",
      decimals: 8, 
      aTokenAddress: "0xde230bC95a03b695be69C44b9AA6C0e9dAc1B143",
    },
    DAI: {
    id: "DAI",
    name: "DAI",
    contractAddress: "0x9A753f0F7886C9fbF63cF59D0D4423C5eFaCE95B",
    decimals: 18, 
    aTokenAddress: "0xDD4f3Ee61466C4158D394d57f3D4C397E91fBc51",
    },
    USDC: {
      id: "USDC",
      name: "USDC",
      contractAddress: "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2",
      decimals: 6,
    },
    AAVE: {
      id: "AAVE",
      name: "AAVE",
      contractAddress: "0x0AB1917A0cf92cdcf7F7b637EaC3A46BBBE41409",
      decimals: 18,
    },
    LINK: {
      id: "LINK",
      name: "ChainLink",
      decimals: 18,
      contractAddress: "0xD9E7e5dd6e122dDE11244e14A60f38AbA93097f2",
    },
   Contracts: {
     AaveOracle: "0x520D14AE678b41067f029Ad770E2870F85E76588",
     WETHGateway: "0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17", //
     PoolAddressProvider: "0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6",
     ProtocolDataProvider: "0x8f57153F18b7273f9A814b93b31Cb3f9b035e7C2",
     ERC20Faucet: "0xc1eB89DA925cc2Ae8B36818d26E12DDF8F8601b0",
   }
 }
 }


const chainIdMap = {
  1:{
      name: "Ethereum Mainnet",
      symbol: "ETH",
  } ,
  3: {
       name: "Ropsten Testnet",
       symbol: "ETH",
  },
  4: {
       name: "Rinkeby Testnet",
       symbol: "ETH",
      },
  5: {
       name: "Goerli Testnet",
       symbol: "ETH",
      },
  42: {
       name: "Kovan Testnet",
       symbol: "ETH",
      },
  137: {
       name: "Polygon Mainnet",
       symbol: "MATIC",
      },
  80001: {
       name: "Mumbai",
       symbol: "MATIC",
      },
  43114: {
       name: "Avalanche Mainnet",
       symbol: "AVAX",
      },
  43113: {
       name: "Fuji Testnet",
       symbol: "AVAX",
      },
  1088: {
       name: "Metis Andromeda Mainnet",
       symbol: "METIS",
      },
  588: {
       name: "Metis Stardust Testnet",
       symbol: "METIS",
      },
  1313161554: {
       name: "Aurora Mainnet",
       symbol: "AOA",
      },
  1313161555: {
       name: "Aurora Testnet",
       symbol: "AOA",
      },
  56: {
       name: "Binance Smart Chain Mainnet",
       symbol: "BNB",
      },
  97: {
       name: "Binance Smart Chain Testnet",
       symbol: "BNB",
      },
  250: {
       name: "Fantom Opera Mainnet",
       symbol: "FTM",
      },
  4002: {
       name: "Fantom Testnet",
       symbol: "FTM",
  },
  81: {
       name: "Shibuya",
       symbol: "SBY"
  },
  }