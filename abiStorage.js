var abis = {
    depositEth: [{
        "inputs": [
          { "internalType": "address", "name": "lendingPool", "type": "address" },
          { "internalType": "address", "name": "onBehalfOf", "type": "address" },
          { "internalType": "uint16", "name": "referralCode", "type": "uint16" },
        ],
        "name": "depositETH",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
      }],
    supply: [{
      "inputs": [
        {"internalType":"address","name":"asset","type":"address"},
        {"internalType":"uint256","name":"amount","type":"uint256"},
        {"internalType":"address","name":"onBehalfOf","type":"address"},
        {"internalType":"uint16","name":"referralCode","type":"uint16"}
      ],
      "name":"supply",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    }],
    supplyWithPermit: [{
      "inputs": [ 
        {"internalType":"address","name":"asset","type":"address"},
        {"internalType":"uint256","name":"amount","type":"uint256"},
        {"internalType":"address","name":"onBehalfOf","type":"address"},
        {"internalType":"uint16","name":"referralCode","type":"uint16"},
        {"internalType":"uint256","name":"deadline","type":"uint256"},
        {"internalType":"uint8","name":"permitV","type":"uint8"},
        {"internalType":"bytes32","name":"permitR","type":"bytes32"},
        {"internalType":"bytes32","name":"permitS","type":"bytes32"}
      ],
      "name":"supplyWithPermit",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    }],
    approve: [{
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }],
    donate: [{
      "inputs": [
        { "internalType": "string", "name": "note", "type": "string" },
      ],
      "name": "newDonation",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
    }],
    poolAddressProvider: [
      {"inputs":[{"internalType":"string","name":"marketId","type":"string"},{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"ACLAdminUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"ACLManagerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"},{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"AddressSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"},{"indexed":true,"internalType":"address","name":"proxyAddress","type":"address"},{"indexed":false,"internalType":"address","name":"oldImplementationAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newImplementationAddress","type":"address"}],"name":"AddressSetAsProxy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"oldMarketId","type":"string"},{"indexed":true,"internalType":"string","name":"newMarketId","type":"string"}],"name":"MarketIdSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"PoolConfiguratorUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"PoolDataProviderUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"PoolUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"PriceOracleSentinelUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldAddress","type":"address"},{"indexed":true,"internalType":"address","name":"newAddress","type":"address"}],"name":"PriceOracleUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"},{"indexed":true,"internalType":"address","name":"proxyAddress","type":"address"},{"indexed":true,"internalType":"address","name":"implementationAddress","type":"address"}],"name":"ProxyCreated","type":"event"},{"inputs":[],"name":"getACLAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getACLManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"getAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarketId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPoolConfigurator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPoolDataProvider","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPriceOracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPriceOracleSentinel","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAclAdmin","type":"address"}],"name":"setACLAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAclManager","type":"address"}],"name":"setACLManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"id","type":"bytes32"},{"internalType":"address","name":"newAddress","type":"address"}],"name":"setAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"id","type":"bytes32"},{"internalType":"address","name":"newImplementationAddress","type":"address"}],"name":"setAddressAsProxy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newMarketId","type":"string"}],"name":"setMarketId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newPoolConfiguratorImpl","type":"address"}],"name":"setPoolConfiguratorImpl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newDataProvider","type":"address"}],"name":"setPoolDataProvider","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newPoolImpl","type":"address"}],"name":"setPoolImpl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newPriceOracle","type":"address"}],"name":"setPriceOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newPriceOracleSentinel","type":"address"}],"name":"setPriceOracleSentinel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}
    ],
}