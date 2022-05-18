/** Connect to Moralis server */
let serverUrl = "https://wiv8xlhz3p4n.usemoralis.com:2053/server";
let appId = "jvb22Emu3AzXUN1A9W6SOPNPGkPoCW4tnh5WGwhI";

//MARK TEMPORARY OVERIDE
//serverUrl = "https://vvkwmpxspsnn.usemoralis.com:2053/server";
//appId = "MUEMJ6Nck6DWuhKWVhhJJjsCCfyzTSJviAQ2xZkq";

// const ETH = {
//     id: "ETH",
//     contractAddress: "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe", //WETHGateway
//     aTokenAddress: "0x608D11E704baFb68CfEB154bF7Fd641120e33aD4",  //WETHaToken
//   }

const db = {
   rinkeby: {
     WETH: {
      id: "WETH",
      contractAddress: "0xd74047010D77c5901df5b0f9ca518aED56C85e8D",
      decimals: 18, 
      aTokenAddress: "0x608D11E704baFb68CfEB154bF7Fd641120e33aD4",
    },
    WBTC: {
      id:"WBTC",
      contractAddress: "0x124F70a8a3246F177b0067F435f5691Ee4e467DD",
      decimals: 8, 
      aTokenAddress: "0xeC1d8303b8fa33afB59012Fc3b49458B57883326",
    },
    DAI: {
    id: "DAI",
    contractAddress: "0x4aAded56bd7c69861E8654719195fCA9C670EB45",
    decimals: 18, 
    aTokenAddress: "0x49866611AA7Dc30130Ac6A0DF29217D16FD87bc0",
  }
    },
  mainnet: {
    WETH: {
     id: "WETH",
     contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
     decimals: 18, 
     aTokenAddress: "0x608D11E704baFb68CfEB154bF7Fd641120e33aD4",
   },
   WBTC: {
     id:"WBTC",
     contractAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
     decimals: 8, 
     aTokenAddress: "0xeC1d8303b8fa33afB59012Fc3b49458B57883326",
   },
   DAI: {
   id: "DAI",
   contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
   decimals: 18, 
   aTokenAddress: "0x49866611AA7Dc30130Ac6A0DF29217D16FD87bc0",
 }
  }
}

Moralis.start({ serverUrl, appId });

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// let options = {
//   filter: {
//       value: ['1000', '1337']    //Only get events where transfer value was 1000 or 1337
//   },
//   fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
//   toBlock: 'latest'
// };

// myContract.getPastEvents('Transfer', options)
//   .then(results => console.log(results))
//   .catch(err => throw err);

// --------------------------
// Polygon Mumbai Donation //
// --------------------------

async function donate(val) {
  let options = {
    contractAddress: "0x356d2E7a0d592bAd95E86d19479c37cfdBb68Ab9",
    functionName: "newDonation",
    abi: abis.donate,
    params: {
      note: "Thanks for your work",
    },
    msgValue: web3.utils.toWei(val, "ether"),
  };
  await Moralis.executeFunction(options);
}

document.getElementById("btn-donate").onclick = function () {
  let donationValue =  document.getElementById("donation-value").value;
  donate(donationValue);
}

// --------------------------//
// Aave Rinkeby Functions    //
// --------------------------//

//Gets the current pool contract address (address sometimes changes, ABI doesn't)
async function getPoolContractAddress() {
const options = {
  chain: chainData["network"],
  address: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
  function_name: "getPool",
  abi: abis.poolAddressProvider,
  params: { },
};
 const lendingPoolAddress = await Moralis.Web3API.native.runContractFunction(options);
 //console.log("current PoolAddress: " + lendingPoolAddress)
 return lendingPoolAddress;
}
//Gets priceOracle contract Address
async function getPriceOracle() {
  const options = {
    chain: chainData["network"],
    address: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
    function_name: "getPriceOracle",
    abi: abis.poolAddressProvider,
    params: { },
  };
   const priceOracleAddress = await Moralis.Web3API.native.runContractFunction(options);
   //console.log("current PriceOracleAddress: " + priceOracleAddress)
   return priceOracleAddress;
   
  }
async function approveERC20(_tokenAddress, _amount){
  let spender = await getPoolContractAddress();
  let approveOptions = {
    contractAddress: _tokenAddress,
    functionName: "approve",
    abi: abis.approve,
    params: {
      _spender: spender,
      _value: _amount,
    }
  };
  Moralis.executeFunction(approveOptions);
}
async function supplyERC20(_tokenAddress, _amount){
 let supplyOptions = {
   contractAddress: await getPoolContractAddress(),
   functionName: "supply",
   abi: abis.poolContract,
   params: {
     asset: _tokenAddress,
     amount: _amount,
     onBehalfOf: selectedAccount,
     referralCode: 0,
   }
   };
   Moralis.executeFunction(supplyOptions);
}
async function withdrawERC20(_tokenAddress, _amount){
 let supplyOptions = {
   contractAddress: await getPoolContractAddress(),
   functionName: "withdraw",
   abi: abis.poolContract,
   params: {
     asset: _tokenAddress,
     amount: _amount,
     to: selectedAccount,
   }
   };
   Moralis.executeFunction(supplyOptions);
}
//DEPOSIT ETH (not WETH)
async function supplyETH(_amount) {
  let options = {
    contractAddress: "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe",
    functionName: "depositETH",
    abi: abis.WETHGateway,
    params: {
      pool: await getPoolContractAddress(),
      onBehalfOf: selectedAccount,
      referralCode: 0,
     },
      msgValue: _amount,
  };
  Moralis.executeFunction(options);
  }
//WITHDRAW ETH (not WETH)
async function withdrawETH(_amount) {
    let options = {
      contractAddress: "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe",
      functionName: "withdrawETH",
      abi: abis.WETHGateway,
      params: {
        pool: await getPoolContractAddress(),
        amount: _amount,
        to: selectedAccount,
       },
    };

  Moralis.executeFunction(options);
}
//getValueDeposited on Aave
async function getDepositedValue(_token) {
  
  let assetAddress = _token.contractAddress;
  let assetName = _token.id;
  let decimals = _token.decimals;
  document.getElementById(`deposited-${assetName}`).classList.remove("blink");
  let options = {
    contractAddress: "0xBAB2E7afF5acea53a43aEeBa2BA6298D8056DcE5",
    functionName: "getUserReserveData",
    abi: abis.AaveProtocolDataProvider,
    params: {
      asset: assetAddress,
      user: selectedAccount,
      },
  };
  let subGraph = await Moralis.executeFunction(options);
  let returnVal = subGraph.currentATokenBalance;
  document.getElementById(`deposited-${assetName}`).innerHTML = returnVal  / 10 ** decimals;
  return returnVal;

  }
//NumberFormatter//
let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',});
async function getRates(_token){
  let assetAddress = _token.contractAddress;
  let assetName = _token.id;
  let options = {
    contractAddress: await getPoolContractAddress(),
    functionName: "getReserveData",
    abi: abis.poolContract,
    params: {
      asset: assetAddress,
    }};
    let subGraph = await Moralis.executeFunction(options);
    let depositAPR = await (subGraph.currentLiquidityRate) / (10**27);
    let depositAPY = (((1 + (depositAPR / 31536000)) ** 31536000) - 1).toFixed(4) * 100; //secondsPerYearHardcoded
    document.getElementById(`interest-${assetName}`).innerHTML = `${depositAPY}%`;

 }
 
 async function getPrice(_token){
   let assetAddress = _token.contractAddress;
   let assetName = _token.id;
  let options = {
    contractAddress: await getPriceOracle(),
    functionName: "getAssetPrice",
    abi: abis.AaveOracle,
    params: {
      asset: assetAddress,
    }};
    let price = await Moralis.executeFunction(options);
    price = formatter.format(Math.abs((price._hex) / 100000000));
    document.getElementById(`price-${assetName}`).innerHTML = `${price}`;
 }


//  async function getEarnings(_token) {
//     let currentATokens = await (getDepositedValue(_token));
//     console.log(currentATokens)
//     //get totalDeposits from localStorage
//     //curentATokens - totalDeposits = live interest earned
//   }

async function ERC20Faucet(_token, _amount) {
      let options = {
        contractAddress: "0x88138CA1e9E485A1E688b030F85Bb79d63f156BA",
        functionName: "mint",
        abi: abis.ERC20Faucet,
        params: {
          _token: _token,
          _amount: _amount,
         },
      };

      Moralis.executeFunction(options);
      }

//FetchABI WIP/////////////
// function getRinkebyABI(_contractAddress){
//   $.getJSON(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${_contractAddress}&apikey=AG1IR692DPYC6M7VPNMEUCXV27N85NEANM`, function(json){
//       return json["result"]
//     }).done(function(data) {
//       getPoolContractAddress(JSON.parse(data.result))
//     });
//   }

  //////////////////////////
/////    ERC20 WETH     ///
//////////////////////////
document.getElementById("btn-approveaWETH").onclick = function() {
  let amountValue =  document.getElementById("amount-ETH").value;
  approveERC20(WETH.contractAddress, Moralis.Units.Token(amountValue, "18"));};
document.getElementById("btn-supplyETH").onclick = function() {
  let amountValue =  document.getElementById("amount-ETH").value;
  supplyETH(Moralis.Units.ETH(amountValue));};
document.getElementById("btn-withdrawETH").onclick = function() {
  let amountValue =  document.getElementById("amount-ETH").value;
  withdrawETH(Moralis.Units.ETH(amountValue));};

  //////////////////////////
/////    ERC20 WBTC     ///
//////////////////////////
document.getElementById("btn-approveWBTC").onclick = function() {
  let amountValue =  document.getElementById("amount-WBTC").value;
  approveERC20(WBTC.contractAddress, Moralis.Units.Token(amountValue, "8"));};
document.getElementById("btn-supplyWBTC").onclick = function() {
  let amountValue =  document.getElementById("amount-WBTC").value;
  supplyERC20(WBTC.contractAddress, Moralis.Units.Token(amountValue, "8"));};
document.getElementById("btn-withdrawWBTC").onclick = function() {
  let amountValue =  document.getElementById("amount-WBTC").value;
  withdrawERC20(WBTC.contractAddress, Moralis.Units.Token(amountValue, "8"));};

  //////////////////////////
/////    ERC20 DAI     ///
//////////////////////////
document.getElementById("btn-approveDAI").onclick = function() {
  let amountValue =  document.getElementById("amount-DAI").value;
  approveERC20(DAI.contractAddress, Moralis.Units.Token(amountValue, "18"));};
document.getElementById("btn-supplyDAI").onclick = function() {
  let amountValue =  document.getElementById("amount-DAI").value;
  supplyERC20(DAI.contractAddress, Moralis.Units.Token(amountValue, "18"));};
document.getElementById("btn-withdrawDAI").onclick = function() {
  let amountValue =  document.getElementById("amount-DAI").value;
  withdrawERC20(DAI.contractAddress, Moralis.Units.Token(amountValue, "18"));};
document.getElementById("btn-getPool").onclick= function() {

  }

//////////////////////////
/////    FAUCETS     /////
//////////////////////////
document.getElementById("btn-faucetWBTC").onclick = () => {ERC20Faucet(WBTC.contractAddress, Moralis.Units.Token("10", "8"));}; //10WBTC
document.getElementById("btn-faucetDAI").onclick = () => {ERC20Faucet(DAI.contractAddress, Moralis.Units.Token("10000", "18")); //10000 DAI
}

// -----------------------
// Transak              //
// -----------------------

function launchTransak(_walletAddress, _cryptoAsset) {
  let transak = new TransakSDK.default({
    apiKey: '7fc30c92-ef84-4d9d-b411-c2e12fe02677',  // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    hostURL: window.location.origin,
    widgetHeight: '625px',
    widgetWidth: '500px',
    // Examples of some of the customization parameters you can pass
    defaultCryptoCurrency: _cryptoAsset, // Example 'ETH'
    walletAddress: _walletAddress, // Your customer's wallet address
    themeColor: 'azure', // App theme color
    hideMenu: true,
    fiatCurrency: '', // Limit fiat selection eg 'USD'
    email: '', // Your customer's email address
    redirectURL: ''
  });
  transak.init();
  // To get all the events
  transak
    .on(transak.ALL_EVENTS, (data) => {
      console.log(data)
    });

  // This will trigger when the user marks payment is made.
  transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log(orderData);
    transak.close();
  });
}

// function transakOpen(_walletAddress, _cryptoAsset) {

//   let bb = launchTransak(_walletAddress, _cryptoAsset);

//   console.log(bb);
//   console.log(1231029498938409234);
//   this.open();

// }
// // window.onload = function() {
  // launchTransak(selectedAccount);
  // console.log(await selectedAccount);
// }



// -----------------------
// TABS NAV             //
// -----------------------

function Tabs() {

  let bindAll = function() {

    let getActiveDataTab;

    if(sessionStorage.getItem('activeDataTab') === null) {
      sessionStorage.setItem('activeDataTab', 'view-1');
      getActiveDataTab = sessionStorage.setItem('activeDataTab', 'view-1');
    }

    if(sessionStorage.getItem('activeDataTab') !== "") {
      getActiveDataTab = sessionStorage.getItem('activeDataTab');
      clear();
      $('[data-tab="'+ getActiveDataTab +'"]').addClass('active');
      $("#" + getActiveDataTab).addClass('active');
    } else {
      sessionStorage.setItem('activeDataTab', 'view-1');
      getActiveDataTab = sessionStorage.getItem('activeDataTab');
      clear();
      $('[data-tab="'+ getActiveDataTab +'"]').addClass('active');
      $("#" + getActiveDataTab).addClass('active');
    }

    let menuElements = document.querySelectorAll('[data-tab]');
    for(let i = 0; i < menuElements.length ; i++) {
      menuElements[i].addEventListener('click', change, false);
    }

  }

  let clear = function() {
    let menuElements = document.querySelectorAll('[data-tab]');
    for(let i = 0; i < menuElements.length ; i++) {
      menuElements[i].classList.remove('active');
      let id = menuElements[i].getAttribute('data-tab');
      document.getElementById(id).classList.remove('active');
    }
  }

  let change = function(e) {
    clear();
    e.target.classList.add('active');
    let id = e.currentTarget.getAttribute('data-tab');
    sessionStorage.setItem('activeDataTab', id);
    document.getElementById(id).classList.add('active');
  }

  bindAll();
}

let connectTabs = new Tabs();


////////////////
///Web3 Modal///
////////////////
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;

let web3Modal;
let provider;
let selectedAccount;


function init() {

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "4a50be229d4d485cb7b65eec5e5d9440",
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
    disableInjectedProvider: false,
  });

  console.log("Web3Modal instance is", web3Modal);

}

async function fetchAccountData() {

  //const web3 = new Web3(provider);
  console.log("Web3 instance is", web3);

  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  let network = chainData["network"];
  console.log(network);
  document.querySelector("#network-name").textContent = chainData.name.split(" ").at(-1);

  const accounts = await web3.eth.getAccounts();

  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  const selectedAccountBalance = await web3.eth.getBalance(accounts[0]);
  const selectedEthBalance = web3.utils.fromWei(selectedAccountBalance, "ether");
  const humanFriendlyBalance = parseFloat(selectedEthBalance).toFixed(4);
  const selectedBalanceSymbol = chainData.name.split(" ").at(-1) == "Mumbai" ? "MATIC" : "ETH";

  document.querySelector("#selected-account").textContent = selectedAccount.substring(0,6) + "..." + selectedAccount.slice(-4);
  document.querySelector("#selected-account-balance").textContent = humanFriendlyBalance + " " + selectedBalanceSymbol;

  // Display fully loaded UI for wallet data
  document.querySelector("#not-connected").style.display = "none";
  document.querySelector("#connected").style.display = "inline-block";

  ///////////////////
  ///USER BALANCES///
  ///////////////////
  //update native ETH Balance
  let balanceShort = new BigNumber(selectedAccountBalance);
  balanceShort = balanceShort.shiftedBy(-18).toFixed(3);
  document.getElementById("eth-balance").innerHTML = balanceShort;



  //updateBalanceERC20
  // getPrice(WETH);
  // getPrice(DAI);
  // getPrice(WBTC);

  // getRates(WETH);
  // getRates(DAI); 
  // getRates(WBTC);

  // updateBalanceERC20(WBTC);
   getERC20Balance(db[network].WBTC)
   getERC20Balance(db[network].DAI)
 
  // // getEarnings(WBTC);
  // // getEarnings(WETH);
  // // getEarnings(DAI);

  // getDepositedValue(WETH);
  // getDepositedValue(WBTC);
  // getDepositedValue(DAI);

  

  // updateUI();
  // async function updateUI() {
  //   console.log("something")
  //   getDepositedValue(WETH);
  //   getDepositedValue(WBTC);
  //   getDepositedValue(DAI);
  //   setTimeout(await updateUI, 5000);
  // };
  
  async function getERC20Balance(_token) {
    let contractAddress = db[network][_token.id].contractAddress;
    let decimals = db[network][_token.id].decimals;
    let id = db[network][_token.id].id;
    const options = {
      contractAddress: contractAddress,
      functionName: "balanceOf",
      abi: abis.aTokenABI,
      params: {
        user: selectedAccount,
      }
    }
    let balance = await Moralis.executeFunction(options);
    document.getElementById(`balance-${id}`).innerHTML = (balance / 10** decimals).toFixed(6);
  
  }


// async function updateBalanceERC20(_token){
//   let contractAddress = db[network][_token.id].contractAddress;
//   const options = {
//     chain: network,
//     address: selectedAccount,
// };
//   let ERC20Balances = await Moralis.Web3API.account.getTokenBalances(options);
//   ERC20Balances.forEach(element => {
//     if (element.token_address === contractAddress.toLowerCase()){
//       let balance = parseFloat((Moralis.Units.FromWei(element.balance, element.decimals))).toFixed(3);
//       console.log(balance)
//       document.getElementById(`balance-${element.symbol}`).innerHTML = balance;
//     }
//   });
// }

}
async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#not-connected").style.display = "block";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


async function onConnect() {
  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();

    let moralisProvider = provider.isMetaMask;

    if (moralisProvider === undefined) {
      moralisProvider = "walletconnect";
    } else {
      moralisProvider = "metamask";
    }
    await Moralis.enableWeb3({ provider: moralisProvider });

  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}


async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  if(provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  selectedAccount = null;

  document.querySelector("#not-connected").style.display = "block";
  document.querySelector("#connected").style.display = "none";

}


window.addEventListener('load', async () => {
  init();

  if(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) await onConnect();

  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);

  document.querySelector("#btn-buyETH").addEventListener("click", function () {launchTransak(selectedAccount, "ETH")});
  document.querySelector("#btn-buyWBTC").addEventListener("click", function () {launchTransak(selectedAccount, "WBTC")});
  document.querySelector("#btn-buyDAI").addEventListener("click", function () {launchTransak(selectedAccount, "DAI")});

});


///////////////////////////
/// Bootstrap Tooltips ///
/////////////////////////

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})