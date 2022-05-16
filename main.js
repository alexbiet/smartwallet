/** Connect to Moralis server */
const serverUrl = "https://wiv8xlhz3p4n.usemoralis.com:2053/server";
const appId = "jvb22Emu3AzXUN1A9W6SOPNPGkPoCW4tnh5WGwhI";


const ETH = "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe"; //Gateway transforms ETH to staked ETH, return aWETH to user
const aWETH = "0xd74047010D77c5901df5b0f9ca518aED56C85e8D"; //must be approved to withdraw supplied ETH
const WBTC = "0x124F70a8a3246F177b0067F435f5691Ee4e467DD";
const DAI = "0x4aAded56bd7c69861E8654719195fCA9C670EB45";

Moralis.start({ serverUrl, appId });

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
    msgValue: Moralis.Units.ETH(val),
  };
  await Moralis.executeFunction(options);
}

document.getElementById("btn-donate").onclick = function () {
  var donationValue =  document.getElementById("donation-value").value;
  donate(donationValue);
}


// --------------------------//
// Aave Rinkeby Functions    //
// --------------------------//

//Gets the current pool contract address (address sometimes changes, ABI doesn't)
async function getPoolContractAddress() {
const options = {
  chain: "rinkeby",
  address: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
  function_name: "getPool",
  abi: abis.poolAddressProvider,
  params: { },
};
 const lendingPoolAddress = await Moralis.Web3API.native.runContractFunction(options);
 console.log("current PoolAddress: " + lendingPoolAddress)
 return lendingPoolAddress;
}
//Gets priceOracle contract Address
async function getPriceOracle() {
  const options = {
    chain: "rinkeby",
    address: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
    function_name: "getPriceOracle",
    abi: abis.poolAddressProvider,
    params: { },
  };
   const priceOracleAddress = await Moralis.Web3API.native.runContractFunction(options);
   console.log("current PriceOracleAddress: " + priceOracleAddress)
   return priceOracleAddress;
   
  }
async function approveERC20(_tokenAddress, _amount, spender){
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
async function getDepositedValue(_asset, _assetName) {
  let options = {
    contractAddress: "0xBAB2E7afF5acea53a43aEeBa2BA6298D8056DcE5",
    functionName: "getUserReserveData",
    abi: abis.AaveProtocolDataProvider,
    params: {
      asset: _asset,
      user: selectedAccount,
      },
  };
  let subGraph = await Moralis.executeFunction(options);
  let returnVal = await Moralis.Units.FromWei(subGraph.currentATokenBalance);
  returnVal = Math.abs(returnVal).toFixed(4);
  document.getElementById(`deposited${_assetName}`).innerHTML = "Deposited Balance: " + returnVal;
  console.log(_assetName)
  }
//
async function getRates(_asset){
  let options = {
    contractAddress: await getPoolContractAddress(),
    functionName: "getReserveData",
    abi: abis.poolContract,
    params: {
      asset: _asset,
    }};
    let subGraph = await Moralis.executeFunction(options);
    let depositAPR = await (subGraph.currentLiquidityRate) / (10**27);
    let depositAPY = (((1 + (depositAPR / 31536000)) ** 31536000) - 1).toFixed(4) * 100; //secondsPerYearHardcoded
    document.getElementById("interestDisplayWETH").innerHTML = `Deposit APY: ${depositAPY}%`;

 }
 
 async function getPrice(_asset, _assetName){
  let options = {
    // contractAddress: await getPriceOracle(),
    contractAddress: "0xA323726989db5708B19EAd4A494dDe09F3cEcc69",
    functionName: "getAssetPrice",
    abi: abis.AaveOracle,
    params: {
      asset: _asset,
    }};
    let price = await Moralis.executeFunction(options);
    price = Math.abs((price._hex) / 100000000);
    document.getElementById(`price${_assetName}`).innerHTML = `${_assetName} Price: $${price}`;
 }

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
  var amountValue =  document.getElementById("amount-ETH").value;
  approveERC20(aWETH, Moralis.Units.Token(amountValue, "18"), getPoolContractAddress());};
document.getElementById("btn-supplyETH").onclick = function() {
  var amountValue =  document.getElementById("amount-ETH").value;
  supplyETH(Moralis.Units.ETH(amountValue));};
document.getElementById("btn-withdrawETH").onclick = function() {
  var amountValue =  document.getElementById("amount-ETH").value;
  withdrawETH(Moralis.Units.ETH(amountValue));};

  //////////////////////////
/////    ERC20 WBTC     ///
//////////////////////////
document.getElementById("btn-approveWBTC").onclick = function() {
  var amountValue =  document.getElementById("amount-WBTC").value;
  approveERC20(WBTC, Moralis.Units.Token(amountValue, "8"));};
document.getElementById("btn-supplyWBTC").onclick = function() {
  var amountValue =  document.getElementById("amount-WBTC").value;
  supplyERC20(WBTC, Moralis.Units.Token(amountValue, "8"));};
document.getElementById("btn-withdrawWBTC").onclick = function() {
  var amountValue =  document.getElementById("amount-WBTC").value;
  withdrawERC20(WBTC, Moralis.Units.Token(amountValue, "8"));};

  //////////////////////////
/////    ERC20 DAI     ///
//////////////////////////
document.getElementById("btn-approveDAI").onclick = function() {
  var amountValue =  document.getElementById("amount-DAI").value;
  approveERC20(DAI, Moralis.Units.Token(amountValue, "18"));};
document.getElementById("btn-supplyDAI").onclick = function() {
  var amountValue =  document.getElementById("amount-DAI").value;
  supplyERC20(DAI, Moralis.Units.Token(amountValue, "18"));};
document.getElementById("btn-withdrawDAI").onclick = function() {
  var amountValue =  document.getElementById("amount-DAI").value;
  withdrawERC20(DAI, Moralis.Units.Token(amountValue, "18"));};
document.getElementById("btn-getPool").onclick= function() {
  getPrice(aWETH, Object.keys({aWETH})[0]);
  getDepositedValue(aWETH, Object.keys({aWETH})[0]);
  getRates(aWETH, Object.keys({aWETH})[0]);
  }

//////////////////////////
/////    FAUCETS     /////
//////////////////////////
document.getElementById("btn-faucetWBTC").onclick = () => {ERC20Faucet(WBTC, Moralis.Units.Token("10", "8"));}; //10WBTC
document.getElementById("btn-faucetDAI").onclick = () => {ERC20Faucet(DAI, Moralis.Units.Token("10000", "18")); //10000 DAI
}

// -----------------------
// Transak              //
// -----------------------

function launchTransak(_walletAddress) {
  let transak = new TransakSDK.default({
    apiKey: '7fc30c92-ef84-4d9d-b411-c2e12fe02677',  // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    hostURL: window.location.origin,
    widgetHeight: '625px',
    widgetWidth: '500px',
    // Examples of some of the customization parameters you can pass
    defaultCryptoCurrency: 'DAI', // Example 'ETH'
    walletAddress: _walletAddress, // Your customer's wallet address
    themeColor: 'azure', // App theme color
    hideMenu: true,
    fiatCurrency: '', // If you want to limit fiat selection eg 'USD'
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
    //transak.close();
  });
}
// window.onload = function() {
  // launchTransak(selectedAccount);
  // console.log(await selectedAccount);
// }



// -----------------------
// TABS NAV             //
// -----------------------

function Tabs() {

  var bindAll = function() {

    var getActiveDataTab;

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

    var menuElements = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElements.length ; i++) {
      menuElements[i].addEventListener('click', change, false);
    }

  }

  var clear = function() {
    var menuElements = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElements.length ; i++) {
      menuElements[i].classList.remove('active');
      var id = menuElements[i].getAttribute('data-tab');
      document.getElementById(id).classList.remove('active');
    }
  }

  var change = function(e) {
    clear();
    e.target.classList.add('active');
    var id = e.currentTarget.getAttribute('data-tab');
    sessionStorage.setItem('activeDataTab', id);
    document.getElementById(id).classList.add('active');
  }

  bindAll();
}

var connectTabs = new Tabs();


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

  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  document.querySelector("#network-name").textContent = chainData.name.split(" ").at(-1);

  const accounts = await web3.eth.getAccounts();

  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  const selectedAccountBalance = await web3.eth.getBalance(accounts[0]);
  const selectedEthBalance = web3.utils.fromWei(selectedAccountBalance, "ether");
  const humanFriendlyBalance = parseFloat(selectedEthBalance).toFixed(4);
  const selectedBalanceSymbol = chainData.name.split(" ").at(-1) == "Mumbai" ? "MATIC" : "ETH";

  document.querySelector("#selected-account").textContent = selectedAccount.substring(0,4) + "..." + selectedAccount.slice(-4);
  document.querySelector("#selected-account-balance").textContent = humanFriendlyBalance + " " + selectedBalanceSymbol;

  // Display fully loaded UI for wallet data
  document.querySelector("#not-connected").style.display = "none";
  document.querySelector("#connected").style.display = "inline-block";
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
  // launchTransak(selectedAccount);
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);


  //Update Deposited Values for Aave _tokenAddress _tokenName
  // async () => {
  // await getDepositedValue(aWETH, Object.keys({aWETH})[0]);
  // await getRates(aWETH, Object.keys({aWETH})[0]);
// }

});




///////////////////////////
/// Bootstrap Tooltips ///
/////////////////////////

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})