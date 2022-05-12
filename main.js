/** Connect to Moralis server */
const serverUrl = "https://wiv8xlhz3p4n.usemoralis.com:2053/server";
const appId = "jvb22Emu3AzXUN1A9W6SOPNPGkPoCW4tnh5WGwhI";
Moralis.start({ serverUrl, appId });


// -----------------------
// Moralis Wallet       //
// -----------------------

// async function login() {
//   let user = Moralis.User.current();
//   if (!user) {
//       try {
//           user = await Moralis.authenticate({ signingMessage: "Hello World!" });
//           await Moralis.enableWeb3();
//           console.log(user);
//           console.log(user.get('ethAddress'));
//       } catch (error) {
//           console.log(error)
//       }
//   }
// }

// async function logOut() {
//   await Moralis.User.logOut();
//   console.log("logged out");
// }

// document.getElementById("btn-login").onclick = login;
// document.getElementById("btn-logout").onclick = logOut;



// -----------------------
// Wallet Connect       //
// -----------------------

// TO IMPLEMENT



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


// --------------------------
// Aave Rinkeby Deposit //
// --------------------------

//First: gets the current pool contract address
async function getPoolContractAddress() {

  let user = Moralis.User.current();
const options = {
  chain: "rinkeby",
  address: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
  function_name: "getPool",
  abi: abis.poolAddressProvider,
  //abi: _contractAbi,
  params: { },
};
 const lendingPoolAddress = await Moralis.Web3API.native.runContractFunction(options);
 console.log("currentPoolAddress: " + lendingPoolAddress)
 return lendingPoolAddress;
}

async function supplyToPool(_poolAddress){
  let user = Moralis.User.current();
 const DAI = "0x2Ec4c6fCdBF5F9beECeB1b51848fc2DB1f3a26af";

 //supply the amount
 let supplyOptions = {
   contractAddress: _poolAddress,
   functionName: "supply",
   abi: abis.supply,
   params: {
     asset: DAI,
     amount: 150,
     onBehalfOf: user.get('ethAddress'),
     referralCode: 0
   }
   };
 
   await console.log(Moralis.executeFunction(supplyOptions));
 
 
}

function approveERC20(_tokenAddress, spender){
        let approveOptions = {
          contractAddress: _tokenAddress,
          functionName: "approve",
          abi: abis.approve,
          params: {
            _spender: spender,
            _value: 1500000,
          }
        };
        Moralis.executeFunction(approveOptions);
      }

document.getElementById("btn-getPool")
.onclick= function() {
  let _contractAddress = "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C";
  getRinkebyABI(_contractAddress)};

function getRinkebyABI(_contractAddress){
  let json = $.getJSON(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${_contractAddress}&apikey=AG1IR692DPYC6M7VPNMEUCXV27N85NEANM`, function(json){
      return json["result"]
    }).done(function(data) {
      getPoolContractAddress(JSON.parse(data.result))
    });
  }

//Second: create lending pool instance

// --------------------------
// Aave Rinkeby Deposit to eth directly //
// --------------------------

async function depositToAave() {

  let user = Moralis.User.current();

  let options = {
    contractAddress: "0xbE8F1f1D3f063C88027CAb4C5315219eeCEa6930",
    functionName: "depositETH",
    abi: abis.depositEth,
    params: {
      lendingPool: "0x3561c45840e2681495ACCa3c50Ef4dAe330c94F8",
      onBehalfOf: user.get('ethAddress'),
      referralCode: 0
    },
    msgValue: Moralis.Units.ETH(0.01),
  };


  await Moralis.executeFunction(options);
  // await Moralis.User.logOut();
  // console.log("logged out");
  console.log("donated!");
}
//approveDaiButton
document.getElementById("btn-depositEth").onclick = depositToAave;
document.getElementById("btn-approveDaiToken").onclick = function() {
  poolAddress = getPoolContractAddress()
  let DAI = "0x2Ec4c6fCdBF5F9beECeB1b51848fc2DB1f3a26af";
  approveERC20(DAI, poolAddress);
};
//supplyDaiButton
document.getElementById("btn-supplyDaiToken").onclick = function() {
  poolAddress = getPoolContractAddress()
  supplyToPool(poolAddress);
};


// -----------------------
// Transak              //
// -----------------------

// TO IMPLEMENT



// -----------------------
// TABS NAV             //
// -----------------------

function Tabs() {
  var bindAll = function() {
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
    document.getElementById(id).classList.add('active');
  }

  bindAll();
}

var connectTabs = new Tabs();




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

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
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
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
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
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "inline-block";
}


async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
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

  selectedAccount = null;

  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}


window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});