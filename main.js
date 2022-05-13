/** Connect to Moralis server */
const serverUrl = "https://wiv8xlhz3p4n.usemoralis.com:2053/server";
const appId = "jvb22Emu3AzXUN1A9W6SOPNPGkPoCW4tnh5WGwhI";

const ETH = "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe"; //Gateway transforms ETH to staked ETH, return aWETH to user
const aWETH = "0xd74047010D77c5901df5b0f9ca518aED56C85e8D"; //must be approved to withdraw supplied ETH
const WBTC = "0x124F70a8a3246F177b0067F435f5691Ee4e467DD";
const DAI = "0x4aAded56bd7c69861E8654719195fCA9C670EB45";

Moralis.start({ serverUrl, appId });

let user = Moralis.User.current();
async function login() {
  let user = Moralis.User.current();
  if (!user) {
      try {
          user = await Moralis.authenticate({ signingMessage: "Hello World!" });
          await Moralis.enableWeb3();
          // console.log(user);
          // console.log(user.get('ethAddress'));
      } catch (error) {
          console.log(error)
      }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;



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
// Aave Rinkeby Functions ////
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
 console.log("currentPoolAddress: " + lendingPoolAddress)
 return lendingPoolAddress;
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
async function supplyERC20(_tokenAddress, _amount, _poolAddress){
 let supplyOptions = {
   contractAddress: _poolAddress,
   functionName: "supply",
   abi: abis.poolContract,
   params: {
     asset: _tokenAddress,
     amount: _amount,
     onBehalfOf: user.get('ethAddress'),
     referralCode: 0,
   }
   };
   Moralis.executeFunction(supplyOptions);
}
async function withdrawERC20(_tokenAddress, _amount, _poolAddress){
 let supplyOptions = {
   contractAddress: _poolAddress,
   functionName: "withdraw",
   abi: abis.poolContract,
   params: {
     asset: _tokenAddress,
     amount: _amount,
     to: user.get('ethAddress'),
   }
   };
   Moralis.executeFunction(supplyOptions);
}
//DEPOSIT ETH (not WETH)
async function supplyETH(_amount, _poolAddress) {
  let options = {
    contractAddress: "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe",
    functionName: "depositETH",
    abi: abis.WETHGateway,
    params: {
      pool: _poolAddress,
      onBehalfOf: user.get('ethAddress'),
      referralCode: 0,
     },
      msgValue: _amount,
  };
  Moralis.executeFunction(options);
  }
//WITHDRAW ETH (not WETH)
async function withdrawETH(_amount, _poolAddress) {
    let options = {
      contractAddress: "0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe",
      functionName: "withdrawETH",
      abi: abis.WETHGateway,
      params: {
        pool: _poolAddress,
        amount: _amount,
        to: user.get('ethAddress'),
       },
    };
    Moralis.executeFunction(options);
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
function getRinkebyABI(_contractAddress){
  $.getJSON(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${_contractAddress}&apikey=AG1IR692DPYC6M7VPNMEUCXV27N85NEANM`, function(json){
      return json["result"]
    }).done(function(data) {
      getPoolContractAddress(JSON.parse(data.result))
    });
  }
  
  //////////////////////////
/////    ERC20 WETH     ///
//////////////////////////
document.getElementById("btn-approveaWETH").onclick = function() {
  var amountValue =  document.getElementById("amount-ETH").value;
  approveERC20(aWETH, Moralis.Units.Token(amountValue, "18"), getPoolContractAddress());};
document.getElementById("btn-supplyETH").onclick = function() {
  var amountValue =  document.getElementById("amount-ETH").value;
  supplyETH(Moralis.Units.ETH(amountValue), getPoolContractAddress());};
document.getElementById("btn-withdrawETH").onclick = function() {
  var amountValue =  document.getElementById("amount-ETH").value;
  withdrawETH(Moralis.Units.ETH(amountValue), getPoolContractAddress());};

  //////////////////////////
/////    ERC20 WBTC     ///
//////////////////////////
document.getElementById("btn-approveWBTC").onclick = function() {
  var amountValue =  document.getElementById("amount-WBTC").value;
  approveERC20(WBTC, Moralis.Units.Token(amountValue, "8"), getPoolContractAddress());};
document.getElementById("btn-supplyWBTC").onclick = function() {
  var amountValue =  document.getElementById("amount-WBTC").value;
  supplyERC20(WBTC, Moralis.Units.Token(amountValue, "8"), getPoolContractAddress());};
document.getElementById("btn-withdrawWBTC").onclick = function() {
  var amountValue =  document.getElementById("amount-WBTC").value;
  withdrawERC20(WBTC, Moralis.Units.Token(amountValue, "8"), getPoolContractAddress());};
  
  //////////////////////////
/////    ERC20 DAI     ///
//////////////////////////
document.getElementById("btn-approveDAI").onclick = function() {
  var amountValue =  document.getElementById("amount-DAI").value;
  approveERC20(DAI, Moralis.Units.Token(amountValue, "18"), getPoolContractAddress());};
document.getElementById("btn-supplyDAI").onclick = function() {
  var amountValue =  document.getElementById("amount-DAI").value;
  supplyERC20(DAI, Moralis.Units.Token(amountValue, "18"), getPoolContractAddress());};
document.getElementById("btn-withdrawDAI").onclick = function() {
  var amountValue =  document.getElementById("amount-DAI").value;
  withdrawERC20(DAI, Moralis.Units.Token(amountValue, "18"), getPoolContractAddress());};
document.getElementById("btn-getPool")
  .onclick= function() {
    let _contractAddress = "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C";
    getRinkebyABI(_contractAddress)};

//////////////////////////
/////    FAUCETS     /////
//////////////////////////
document.getElementById("btn-faucetWBTC").onclick = () => {ERC20Faucet(WBTC, Moralis.Units.Token("10", "8"));}; //10WBTC
document.getElementById("btn-faucetDAI").onclick = () => {ERC20Faucet(DAI, Moralis.Units.Token("10000", "18")); //10000 DAI
}

// -----------------------
// Transak              //
// -----------------------

// TO IMPLEMENT



// -----------------------
// TABS NAV             //
// -----------------------

function Tabs() {
  var bindAll = function() {
    var getActiveDataTab = sessionStorage.getItem('activeDataTab');
    if(getActiveDataTab !== "") {
      clear();
      $('[data-tab="'+ getActiveDataTab +'"]').addClass('active');
      document.getElementById(getActiveDataTab).classList.add('active');
    } else {
      sessionStorage.setItem('activeDataTab', 'view-1');
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




// sessionStorage.setItem('activeTab', 'Some Name');
// var name = sessionStorage.getItem('activeTab');



/////////////////////////////////////
// Get ABI of any verified contract//
// /////////////////////////////////////
// function queryABIrinkeby(_contractAddress) {

    
// }

// //queryABIrinkeby("0xBA6378f1c1D046e9EB0F538560BA7558546edF3C")
// // .then((json) => { console.log(json)})







// ------------------------------
// WALLET CONNECT + METAMASK   //
// ------------------------------

// const Web3Modal = window.Web3Modal.default;
// const WalletConnectProvider = window.WalletConnectProvider.default;
// const Fortmatic = window.Fortmatic;
// const evmChains = window.evmChains;

// let web3Modal;
// let provider;
// let selectedAccount;

// function init() {

//   const providerOptions = {
//     walletconnect: {
//       package: WalletConnectProvider,
//       options: {
//         infuraId: "4a50be229d4d485cb7b65eec5e5d9440",
//       }
//     }
//   };

//   web3Modal = new Web3Modal({
//     cacheProvider: false, // optional
//     providerOptions, // required
//     disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
//   });

//   console.log("Web3Modal instance is", web3Modal);
// }



// async function fetchAccountData() {

//   const web3 = new Web3(provider);

//   console.log("Web3 instance is", web3);

//   const chainId = await web3.eth.getChainId();
//   const chainData = evmChains.getChain(chainId);
//   document.querySelector("#network-name").textContent = chainData.name.split(" ").at(-1);

//   const accounts = await web3.eth.getAccounts();
//   console.log("Got accounts", accounts);
//   selectedAccount = accounts[0];
//   const selectedAccountBalance = await web3.eth.getBalance(accounts[0]);
//   const selectedEthBalance = web3.utils.fromWei(selectedAccountBalance, "ether");
//   const humanFriendlyBalance = parseFloat(selectedEthBalance).toFixed(4);
//   const selectedBalanceSymbol = chainData.name.split(" ").at(-1) == "Mumbai" ? "MATIC" : "ETH";

//   document.querySelector("#selected-account").textContent = selectedAccount.substring(0,4) + "..." + selectedAccount.slice(-4);
//   document.querySelector("#selected-account-balance").textContent = humanFriendlyBalance + " " + selectedBalanceSymbol;

//   // Display fully loaded UI for wallet data
//   document.querySelector("#prepare").style.display = "none";
//   document.querySelector("#connected").style.display = "inline-block";
// }


// async function refreshAccountData() {
//   document.querySelector("#connected").style.display = "none";
//   document.querySelector("#prepare").style.display = "block";
//   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
//   await fetchAccountData(provider);
//   document.querySelector("#btn-connect").removeAttribute("disabled")
// }


// async function onConnect() {

//   console.log("Opening a dialog", web3Modal);
//   try {
//     provider = await web3Modal.connect();
//   } catch(e) {
//     console.log("Could not get a wallet connection", e);
//     return;
//   }

//   // Subscribe to accounts change
//   provider.on("accountsChanged", (accounts) => {
//     fetchAccountData();
//   });

//   // Subscribe to chainId change
//   provider.on("chainChanged", (chainId) => {
//     fetchAccountData();
//   });

//   // Subscribe to networkId change
//   provider.on("networkChanged", (networkId) => {
//     fetchAccountData();
//   });

//   await refreshAccountData();
// }


// async function onDisconnect() {

//   console.log("Killing the wallet connection", provider);

//   if(provider.close) {
//     await provider.close();
//     await web3Modal.clearCachedProvider();
//     provider = null;
//   }

//   selectedAccount = null;

//   document.querySelector("#prepare").style.display = "block";
//   document.querySelector("#connected").style.display = "none";
// }


// window.addEventListener('load', async () => {
//   init();
//   document.querySelector("#btn-connect").addEventListener("click", onConnect);
//   document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
// });