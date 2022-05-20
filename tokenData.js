const db = {
    rinkeby: {
      ETH: {
       id: "WETH",
       name: "Wrapped ETH",
       contractAddress: "0xd74047010D77c5901df5b0f9ca518aED56C85e8D",
       decimals: 18, 
       aTokenAddress: "0x608D11E704baFb68CfEB154bF7Fd641120e33aD4",
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
     Contracts: {
       AaveOracle: "0xA323726989db5708B19EAd4A494dDe09F3cEcc69",
       WETHGateway: "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe",
       PoolAddressProvider: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
       ProtocolDataProvider: "0xBAB2E7afF5acea53a43aEeBa2BA6298D8056DcE5",
       ERC20Faucet: "0x88138CA1e9E485A1E688b030F85Bb79d63f156BA",
     }
     },
   mainnet: {
     ETH: {
       id: "MATIC",
       name: "MATIC",
       decimals: 18,
       contractAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
 
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
   Contracts: {
     AaveOracle: "0xb023e699F5a33916Ea823A16485e259257cA8Bd1",
     WETHGateway: "0x9BdB5fcc80A49640c7872ac089Cc0e00A98451B6",
     PoolAddressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
     ProtocolDataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
 
   },
   },
   testnet: {
     ETH: {
       id: "MATIC",
       name: "MATIC",
       decimals: 18,
       contractAddress: "0xb685400156cF3CBE8725958DeAA61436727A30c3",
 
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
   Contracts: {
     AaveOracle: "0x520D14AE678b41067f029Ad770E2870F85E76588",
     WETHGateway: "0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17", //
     PoolAddressProvider: "0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6",
     ProtocolDataProvider: "0x8f57153F18b7273f9A814b93b31Cb3f9b035e7C2",
     ERC20Faucet: "0xc1eB89DA925cc2Ae8B36818d26E12DDF8F8601b0",
   }
 }
 }