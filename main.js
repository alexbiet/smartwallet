/** Connect to Moralis server */
let serverUrl = "https://wiv8xlhz3p4n.usemoralis.com:2053/server";
let appId = "jvb22Emu3AzXUN1A9W6SOPNPGkPoCW4tnh5WGwhI";
//MARK TEMPORARY OVERIDE
//serverUrl = "https://vvkwmpxspsnn.usemoralis.com:2053/server";
//appId = "MUEMJ6Nck6DWuhKWVhhJJjsCCfyzTSJviAQ2xZkq";
Moralis.start({ serverUrl, appId });

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

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
    network: 'polygon', 
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

  //console.log("Web3Modal instance is", web3Modal);

  if(localStorage.getItem("smart-wallet-theme")) {
    if (localStorage.getItem("smart-wallet-theme") == "light") {
        $('body').removeClass('bg-dark');
        $("#modeButton i").removeClass().toggleClass('bi bi-moon');
        document.getElementById("wallet-logo").src = 'images/logo-light.png';
    } else {
      $('body').addClass('bg-dark');
      $("#modeButton i").removeClass().toggleClass('bi bi-sun');
      localStorage.setItem("smart-wallet-theme", "dark");
      document.getElementById("wallet-logo").src = 'images/logo-dark.png';
    }
  }
  
  
}

async function fetchAccountData() {

  //const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  let network = chainData["network"];
  //console.log("Web3 instance is", web3, "Network is: " + network);
  document.querySelector("#network-name").textContent = chainData.name;


  // Display Selected Network with Persistance
  document.getElementById("rinkeby").checked = false;
  document.getElementById("mumbai").checked = false;
  document.getElementById("polygon").checked = false;

  console.log(network);

  switch(network) {
    case "rinkeby" :
      document.getElementById("rinkeby").checked = true;
    break;

    case "testnet" :
      document.getElementById("mumbai").checked = true;
    break;

    case "mainnet" :
      document.getElementById("polygon").checked = true;
    break;
  }


  const accounts = await web3.eth.getAccounts();
  selectedAccount = accounts[0];
  const selectedAccountBalance = await web3.eth.getBalance(accounts[0]);
  const selectedEthBalance = web3.utils.fromWei(selectedAccountBalance, "ether");
  const humanFriendlyBalance = parseFloat(selectedEthBalance).toFixed(4);
  let selectedBalanceSymbol = "ETH";
  if(network === "rinkeby"){
    selectedBalanceSymbol = "ETH";
  }else {
    selectedBalanceSymbol = chainData["nativeCurrency"].symbol;
  }
  document.querySelector("#selected-account").textContent = selectedAccount.substring(0,6) + "..." + selectedAccount.slice(-4);
  document.querySelector("#selected-account-balance").textContent = humanFriendlyBalance + " " + selectedBalanceSymbol;

  // Display fully loaded UI for wallet data
  document.querySelector("#not-connected").style.display = "none";
  document.querySelector("#connected").style.display = "inline-block";

    // document.getElementById("native-img").src = `images/${nativeAsset}.svg`;
    // document.getElementById("native-symbol").innerHTML = `${nativeAsset}`;
    // document.getElementById("native-asset").innerHTML = `${nativeAsset}`;
    // document.getElementById("native-price").innerHTML = `1 ${nativeAsset} = <span id="price-ETH">${nativePrice}</span>`;
    // document.getElementById("balance-ETH").innerHTML = `<span id="eth-balance">${nativeBalance.toFixed(4)}</span> ${nativeAsset}`;
    // document.getElementById("native-supply").innerHTML = `<span id="deposited-ETH">0.00</span> ${nativeAsset}`;


generateCards(["WBTC","DAI"]);
async function generateCards(_tokenArray) {
  let nativeAsset = chainData["nativeCurrency"].symbol;
  if(nativeAsset === "RIN"){ nativeAsset = "ETH";}
  let nativeBalance = selectedAccountBalance / 10**18;
  let nativePrice = await getPrice("ETH");
  const containerEl = document.getElementById("card-container");
 
  let tempContainer = `<t-card network="${network}" tokenName="${nativeAsset}" tokenTicker="${nativeAsset}"></t-card>`;
  for(let i = 0; i < _tokenArray.length; i++){
    _token = _tokenArray[i];
    tokenId = db[network][_token].id;
     tokenName = db[network][_token].name;
       tempContainer += `<t-card network="${network}" tokenName="${tokenName}" tokenTicker="${tokenId}"></t-card>`
  }  
  containerEl.innerHTML = tempContainer;
  document.getElementById(`price-${nativeAsset}`).innerHTML = nativePrice;
   //document.getElementById("native-symbol").innerHTML = `${nativeAsset}`;
  // document.getElementById("native-asset").innerHTML = `${nativeAsset}`;
   document.getElementById(`balance-${nativeAsset}`).innerHTML = nativeBalance.toFixed(4);
  //document.getElementById(`deposited-${nativeAsset}`).innerHTML = getDepositedValue(nativeAsset);
  // document.getElementById(`interest-${nativeAsset}`).innerHTML = getRates("ETH")
  // document.querySelector("#btn-buyETH").addEventListener("click", function () {launchTransak(selectedAccount, "ETH")}); 
  
  //add onClicks
  for(let i = 0; i < _tokenArray.length; i++){
  _token = _tokenArray[i];
  tokenId = db[network][_token].id;
  document.getElementById(`btn-approve${tokenId}`).onclick = function() {
    let amountValue =  document.getElementById(`amount-${tokenId}`).value;
    approveERC20(`${tokenId}`, amountValue);};
  document.getElementById(`btn-supply${tokenId}`).onclick = function() {
    let amountValue =  document.getElementById(`amount-${tokenId}`).value;
    supplyERC20(`${tokenId}`, amountValue);};
  document.getElementById(`btn-withdraw${tokenId}`).onclick = function() {
    let amountValue =  document.getElementById(`amount-${tokenId}`).value;
    withdrawERC20(`${tokenId}`, amountValue);};
  updateCard(_token);
    if(network ==="mainnet"){
      document.querySelector(`#btn-buy${tokenId}`).addEventListener("click", function () {launchTransak(selectedAccount, `${tokenId}`)});
    } else {
      document.getElementById(`btn-faucet${tokenId}`).onclick = () => {ERC20Faucet(`${tokenId}`, `10000`)}; //10000 ${tokenId}
    }
  }
  
}

async function updateCard(_tokenName){
  getPrice(_tokenName);
  getERC20Balance(_tokenName);
  getRates(_tokenName);
  getDepositedValue(_tokenName);
}
  
  async function getERC20Balance(_token) {
    let contractAddress = db[network][_token].contractAddress;
    let decimals = db[network][_token].decimals;
    let id = db[network][_token].id;
    const options = {
      contractAddress: contractAddress,
      functionName: "balanceOf",
      abi: abis.aTokenABI,
      params: {
        user: selectedAccount,
      }
    }
    let balance = await Moralis.executeFunction(options);
    balance = (balance / 10 ** decimals).toFixed(6);
    document.getElementById(`balance-${[_token]}`).innerHTML = balance;
  }

  async function getPrice(_token){
    let assetAddress = db[network][_token].contractAddress;
    let assetName = db[network][_token].id;
   let options = {
     contractAddress: await getPriceOracle(),
     functionName: "getAssetPrice",
     abi: abis.AaveOracle,
     params: {
       asset: assetAddress,
     }};
     let price = await Moralis.executeFunction(options);
       //NumberFormatter//
let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',});
     price = formatter.format(Math.abs((price._hex) / 100000000));
      if(assetName === "MATIC" || assetName === "ETH")
       return price;
     else {
      document.getElementById(`price-${_token}`).innerHTML = `${price}`;
       return price;
    // }
     
  }
}
  //Gets the current pool contract address (address sometimes changes, ABI doesn't)
async function getPoolContractAddress() {
  const options = {
    chain: network,
    contractAddress: db[network].Contracts.PoolAddressProvider,
    functionName: "getPool",
    abi: abis.poolAddressProvider,
    params: { },
  };
   const lendingPoolAddress = await Moralis.executeFunction(options);
   return lendingPoolAddress;
  }

  //Gets priceOracle contract Address
async function getPriceOracle() {
  const options = {
    chain: network,
    contractAddress: db[network].Contracts.PoolAddressProvider,
    functionName: "getPriceOracle",
    abi: abis.polygonPoolAddressProvider,
    params: { },
  };

   const priceOracleAddress = await Moralis.executeFunction(options);
   return priceOracleAddress;
  }

  //getValueSupplied on Aave
async function getDepositedValue(_token) {
  let assetAddress = db[network][_token].contractAddress;
  let assetName = db[network][_token].id;
  let decimals = db[network][_token].decimals;
  
  let options = {
    contractAddress: db[network].Contracts.ProtocolDataProvider,
    functionName: "getUserReserveData",
    abi: abis.AaveProtocolDataProvider,
    params: {
      asset: assetAddress,
      user: selectedAccount,
      },
  };
  let subGraph = await Moralis.executeFunction(options);
  let returnVal = subGraph.currentATokenBalance;
  document.getElementById(`deposited-${_token}`).innerHTML = returnVal  / 10 ** decimals;
  return returnVal;
  }

async function getRates(_token){
  let assetAddress = db[network][_token].contractAddress;
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
    document.getElementById(`interest-${_token}`).innerHTML = `${depositAPY.toFixed(2)}%`;

 }
 
 async function approveERC20(_token, _amount){
  let spender = await getPoolContractAddress();
  let tokenContract = db[network][_token].contractAddress;
  let decimals = db[network][_token].decimals;
  let amount = _amount;
  if (decimals === 8) {
     amount = amount * 10**8;
     amount = amount.toFixed();
 } else {
     amount = web3.utils.toWei(_amount);
 }
  let options = {
    contractAddress: tokenContract,
    functionName: "approve",
    abi: abis.approve,
    params: {
      _spender: spender,
      _value: amount,
    }
  };
  Moralis.executeFunction(options);
}

async function supplyERC20(_token, _amount){
  let tokenAddress = db[network][_token].contractAddress;
  let decimals = db[network][_token].decimals;
  let amount = _amount;
  if (decimals === 8) {
     amount = amount * 10**8;
     amount = amount.toFixed();
 } else {
     amount = web3.utils.toWei(_amount);
 }
  let supplyOptions = {
    contractAddress: await getPoolContractAddress(),
    functionName: "supply",
    abi: abis.poolContract,
    params: {
      asset: tokenAddress,
      amount: amount,
      onBehalfOf: selectedAccount,
      referralCode: 0,
    }
    };
    Moralis.executeFunction(supplyOptions);
 }
 async function withdrawERC20(_token, _amount){
  let tokenAddress = db[network][_token].contractAddress;
  let decimals = db[network][_token].decimals;
  let amount = _amount;
  if (decimals === 8) {
     amount = amount * 10**8;
     amount = amount.toFixed();
 } else {
     amount = web3.utils.toWei(_amount);
 }
  let supplyOptions = {
    contractAddress: await getPoolContractAddress(),
    functionName: "withdraw",
    abi: abis.poolContract,
    params: {
      asset: tokenAddress,
      amount: amount,
      to: selectedAccount,
    }
    };
    Moralis.executeFunction(supplyOptions);
 }

 //DEPOSIT Native Token (not WETH)
async function supplyETH(_amount) {
  let amount = _amount * 10**18;
  amount = amount.toString();
  let options = {
    contractAddress: db[network].Contracts.WETHGateway,
    functionName: "depositETH",
    abi: abis.WETHGateway,
    params: {
      pool: await getPoolContractAddress(),
      onBehalfOf: selectedAccount,
      referralCode: 0,
     },
      msgValue: amount,
  };
  Moralis.executeFunction(options);
  }
//WITHDRAW Native Token (not WETH)
async function withdrawETH(_amount) {
  let amount = _amount * 10**18;
    let options = {
      contractAddress: db[network].Contracts.WETHGateway,
      functionName: "withdrawETH",
      abi: abis.WETHGateway,
      params: {
        pool: await getPoolContractAddress(),
        amount: amount.toString(),
        to: selectedAccount,
       },
    };

  Moralis.executeFunction(options);
}

async function ERC20Faucet(_token, _amount) {
  let decimals = db[network][_token].decimals;
  let amount = _amount;
  if (decimals === 8) {
     amount = amount * 10**8;
     amount = amount.toFixed();
 } else {
     amount = web3.utils.toWei(_amount);
 }
  contractAddress = db[network].Contracts.ERC20Faucet;
  tokenAddress = db[network][_token].contractAddress;

      let options = {
        contractAddress: contractAddress,
        functionName: "mint",
        abi: abis.ERC20Faucet,
        params: {
          _token: tokenAddress,
          _amount: amount,
         },
      };

      Moralis.executeFunction(options);
      }

}
async function refreshAccountData() {
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#not-connected").style.display = "block";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


async function onConnect() {
  //console.log("Opening a dialog", web3Modal);
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
//Mar4kcmne
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
/////////////////////////
//////Switch Networks//////
//or ADD nonexisting RPC///
////////////////////////////
const switchNetworkPolygon = async () => {
  try {
    await web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x89" }],
    });
  } catch (error) {
    if (error.code === 4902) {
      try {
        await web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x89",
              chainName: "Polygon",
              rpcUrls: ["https://polygon-rpc.com"],
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: ["https://polygonscan.com"],
            },
          ],
        });

      } catch (error) {
        alert(error.message);
      }
    }
  }
}
const switchNetworkMumbai = async () => {
  try {
    await web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
  } catch (error) {
    if (error.code === 4902) {
      try {
        await web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              chainName: "Mumbai",
              rpcUrls: ["https://rpc-mumbai.matic.today"],
              nativeCurrency: {
                name: "Matic",
                symbol: "Matic",
                decimals: 18,
              },
              blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
            },
          ],
        });
      } catch (error) {
        alert(error.message);
      }
    }
  }
}
const switchNetworkRinkeby = async () => {
  try {
    await web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }],
    });
  } catch (error) {
    if (error.code === 4902) {
      try {
        await web3.currentProvider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x4",
              chainName: "Rinkeby",
              rpcUrls: ["https://rinkeby.infura.io/v3/"],
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://rinkeby.etherscan.io"],
            },
          ],
        });
      } catch (error) {
        alert(error.message);
      }
    }
  }
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

  document.querySelector("#radio-rinkeby").addEventListener("click", function () {switchNetworkRinkeby();});
  document.querySelector("#radio-mumbai").addEventListener("click", function () {switchNetworkMumbai();});
  document.querySelector("#radio-polygon").addEventListener("click", function () {switchNetworkPolygon();});
});


///////////////////////////
/// Bootstrap Tooltips ///
/////////////////////////

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})



///////////////////////////
/// Bootstrap Modal    ///
/////////////////////////

var myModal = document.getElementById('welcomeInfoModal');
var myInput = document.getElementById('welcomeInfoInput');

myModal.addEventListener('shown.bs.modal', function () {
  // myInput.focus();
})


///////////////////////////
/// Bootstrap Popover  ///
/////////////////////////

// var popover1 = new bootstrap.Popover(document.querySelector('.popover-dismiss-1'), {
//   trigger: 'focus',
//   html: true,
//   // title: 'Title 1',
//   content: [
//   '<p><b>Learn Mode (Testnet)</b> - Use Rinkeby or Mumbai to get faucet crypto and interact risk-free with Aave V3.</p>',
//   '<p class="mb-0"><b>Polygon Mainnet</b> - Buy real crypto assets via Transak and supply the Aave V3 lending pools to earn APY.</p>'].join(''),
// })

// var popover2 = new bootstrap.Popover(document.querySelector('.popover-dismiss-2'), {
//   trigger: 'focus',
//   html: true,
//   // title: 'Title 2',
//   content: [
//     '<p><b>Balance</b> - The amount of this crypto asset available inside your connected wallet.</p>',
//     '<p><b>Buy (mainnet)</b> - Buy an amount of this crypto asset on Polygon using Transak online payments: debit card, credit card and more.</p>',
//     '<p><b>Get Faucet (learn mode)</b> - Get an amount of this crypto asset for free on testnet (Rinkeby or Mumbai) for learning purposes.</p>',
//     '<div class="alert alert-warning mb-0"><b>Note:</b> The faucet crypto assets on Rinkeby and Mumbai testnet <u>have zero financial value</u>.</div>'].join(''),
// })

// var popover3 = new bootstrap.Popover(document.querySelector('.popover-dismiss-3'), {
//   trigger: 'focus',
//   html: true,
//   // title: 'Title 3',
//   content: [
//     '<p><b>Annual Percentage Yield (APY)</b> - acts as a crypto savings account similar to an annual percentage rate (APR) bank account.</p>',
//     '<p class="mb-0">You may supply (deposit) your crypto asset and receive a fixed rate of return over a specific period of time.</p>'].join(''),
// })

// var popover4 = new bootstrap.Popover(document.querySelector('.popover-dismiss-4'), {
//   trigger: 'focus',
//   html: true,
//   // title: 'Title 4',
//   content: [
//     '<p class="mb-0"><b>Supply (Deposit)</b> - The amount of the crypto asset you supply to the Aave V3 lending pool and culmulated real-time APY earnings.</p>'].join(''),
// })

// var popover5 = new bootstrap.Popover(document.querySelector('.popover-dismiss-5'), {
//   trigger: 'focus',
//   html: true,
//   // title: 'Supply to Aave V3 Lending Pool',
//   content: [
//     '<p><b>Aave V3 Lending - Supply & Withdraw</b></p>',
//     '<p><span class="badge rounded-pill bg-warning text-dark"><i class="bi bi-check-circle"></i> Approve</span> - Type the amount of crypto you want to approve for Aave V3 lending pool and press "<span class="badge rounded-pill bg-warning text-dark"><i class="bi bi-check-circle"></i></span>".</p>',
//     '<p><span class="badge rounded-pill bg-success"><i class="bi bi-plus-circle"></i> Supply</span> - Type the amount of crypto within the approved range you want to supply (deposit) to the Aave V3 lending pool and press "<span class="badge rounded-pill bg-success"><i class="bi bi-plus-circle"></i></span>"</p>',
//     '<p class="mb-0"><span class="badge rounded-pill bg-danger"><i class="bi bi-dash-circle"></i> Withdraw</span> - Type the amount of crypto you want to withdraw from your supply on the Aave V3 lending pool and press "<span class="badge rounded-pill bg-danger"><i class="bi bi-dash-circle"></i></span>".</p>'].join(''),
// })


///////////////////////////
/// Light / Dark Mode  ///
/////////////////////////

$('.switch').click(()=>{
  // $([".light [class*='-light']", ".dark [class*='-dark']"]).each((i,ele)=>{
  //     $(ele).toggleClass('bg-light bg-dark')
  //     $(ele).toggleClass('text-light text-dark')
  //     $(ele).toggleClass('btn-outline-light btn-outline-dark')
  // })
  // toggle body class selector
  $('body').toggleClass('bg-dark');
  $('#modeButton i').toggleClass('bi-moon bi-sun'); 

  if($('body').hasClass('bg-dark')) {
    document.getElementById("wallet-logo").src = 'images/logo-dark.png';
    localStorage.setItem("smart-wallet-theme", "dark");
  } else {
    document.getElementById("wallet-logo").src = 'images/logo-light.png';
    localStorage.setItem("smart-wallet-theme", "light");
  }
  
})
