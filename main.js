let useRPC = true;
window.addEventListener('load', async () => {
  document.getElementById("btn-connect").addEventListener("click", () => { useRPC = false; fetchAccountData()});
  document.getElementById("btn-disconnect").addEventListener("click", onDisconnect);

  document.querySelector("#radio-rinkeby").addEventListener("click", function () { switchNetworkRinkeby(); });
  document.querySelector("#radio-mumbai").addEventListener("click", function () { switchNetworkMumbai(); });
  document.querySelector("#radio-polygon").addEventListener("click", function () { switchNetworkPolygon(); });


  try {
    if(ethereum.isMetaMask && localStorage.getItem("CACHED_PROVIDER") === "TRUE") {
        useRPC = false;
        fetchAccountData();
      } else {
        useRPC = true;
        fetchAccountData();
      };
  } catch (error) {
    console.log("Error connecting to metamask account:\n", error)
    if (window.confirm("Install Metamask to access Web3 Content. \nClick OK to be directed to metamask.io ")) {
      window.open("http://metamask.io", "_blank");
    };
  }

  // theme light/dark
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
  
  $('[data-toggle="popover"]').popover()
  // document.querySelector("#wallet-navigation").style.display = "none";

});

function onDisconnect() {
  alert("To disconnect, open MetaMask and manualy disconnect.");

  document.querySelector("#not-connected").style.display = "block";
  document.querySelector("#connected").style.display = "none";

  // document.querySelector("#wallet-navigation").style.display = "none";
  // document.querySelector("#wallet-intro").style.display = "block";
  // document.querySelector("#card-container").style.display = "none";
}

let chain;
let network;
let symbol;
if(useRPC) {
  chain = "Rinkeby Testnet";
  network = "rinkeby";
  symbol = "ETH";
}


async function fetchAccountData() {
  let provider;
  let signer;
  let account;
  let formatedBalance;
  let balance;
  

  if(!useRPC) {
    chain = chainIdMap[Number(ethereum.chainId)].name;
    network = chainIdMap[Number(ethereum.chainId)].name.split(' ')[0].toLowerCase();
    symbol = chainIdMap[Number(ethereum.chainId)].symbol;
  }

    try {
        if(!useRPC){
          provider = new ethers.providers.Web3Provider(ethereum);
          signer = provider.getSigner()
          account = await provider.send("eth_requestAccounts").then( accounts => {
            return accounts[0];});
            balance = await provider.getBalance(account);
        formatedBalance = ethers.BigNumber.from(balance);
        formatedBalance = balance.mod(1e14);
        formatedBalance = ethers.utils.formatEther(balance.sub(formatedBalance));
        document.getElementById("selected-account").innerHTML = `${account.substring(0,6) + "..." + account.slice(-4)}`;
        document.getElementById("account-balance").innerHTML = `${formatedBalance} ${chainIdMap[ethereum.networkVersion].symbol}`;
        document.getElementById("network-name").innerHTML = `${chainIdMap[ethereum.networkVersion].name}`;

        document.getElementById("not-connected").style.display = "none";
        document.getElementById("connected").style.display = "block";
        localStorage.setItem("CACHED_PROVIDER", "TRUE");


        } else {
          provider = new ethers.providers.AlchemyProvider(
            4,
            "vd1ojdJ9UmyBbiKOxpWVnGhDpoFVVxBY"
          );
  
        }
 
        
        
        //updateHTMLElements network/balances/button
 


        // document.querySelector("#wallet-navigation").style.display = "block";
        // document.querySelector("#wallet-intro").style.display = "none";
        // document.querySelector("#card-container").style.display = "block";


  
    } catch (error) {
        console.log("Error connecting to metamask account:\n", error)
      }

  ethereum.on("accountsChanged", (accounts) => {
      if(accounts[0]) {
        fetchAccountData();
      } else {
        localStorage.removeItem("CACHED_PROVIDER");

        document.getElementById("not-connected").style.display = "block";
        document.getElementById("connected").style.display = "none";
      }
  });
  ethereum.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  


  // Display Selected Network with Persistance
  document.getElementById("rinkeby").checked = false;
  document.getElementById("mumbai").checked = false;
  document.getElementById("polygon").checked = false;

  // check chain values
  switch(network) { 
    case "rinkeby" :
      document.getElementById("rinkeby").checked = true;
    break;

    case "mumbai" :
      document.getElementById("mumbai").checked = true;
    break;

    case "polygon" :
      document.getElementById("polygon").checked = true;
    break;
  }


generateCards(["WBTC", "DAI","AAVE","LINK","USDC"]);
async function generateCards(_tokenArray) {
  
  document.querySelector("#card-container").style.removeProperty('display');
  let nativeAsset = symbol;
  if(nativeAsset === "RIN"){ nativeAsset = "ETH";}
  let nativeBalance = "0.00";
  if(formatedBalance) nativeBalance = formatedBalance; // WIP
  let nativePrice;
  let depositedValue;
  let nativeRate;
  !useRPC ? 
  nativePrice = await getPrice("ETH") : nativePrice = "$1,500.00";
  !useRPC ? 
  depositedValue = await getDepositedValue("ETH") : depositedValue = 0
  !useRPC ? 
  nativeRate = await getRates("ETH") : nativeRate = 0;
  
  const containerEl = document.getElementById("card-container");
  console.log(network)
  let tempContainer = `<t-card network="${network}" tokenName="${db[network]["ETH"].name}" tokenTicker="${nativeAsset}"></t-card>`;
  for(let i = 0; i < _tokenArray.length; i++){
    _token = _tokenArray[i];
    tokenId = db[network][_token].id;
     tokenName = db[network][_token].name;
     tempContainer += `<t-card network="${network}" tokenName="${tokenName}" tokenTicker="${tokenId}"></t-card>`
  }  
  containerEl.innerHTML = tempContainer;
  document.getElementById(`price-${nativeAsset}`).innerHTML = nativePrice;
   document.getElementById(`balance-${nativeAsset}`).innerHTML = nativeBalance;
   document.getElementById(`deposited-${nativeAsset}`).innerHTML = depositedValue;
   document.getElementById(`interest-${nativeAsset}`).innerHTML = nativeRate + "%";

    if(network === "polygon"){
    document.querySelector(`#btn-buy${nativeAsset}`).addEventListener("click", function () {launchTransak(account, nativeAsset)}); 
  } else if(network === "rinkeby") {
   document.querySelector(`#btn-faucet${nativeAsset}`).addEventListener("click", function () {
       window.open(
         "https://rinkebyfaucet.com/", "_blank");
   })} else if(network === "mumbai") {
    document.querySelector(`#btn-faucet${nativeAsset}`).addEventListener("click", function () {
        window.open(
          "https://mumbaifaucet.com/", "_blank");
    })}
    document.getElementById(`btn-approve${nativeAsset}`).onclick = function() {
     let amountValue =  document.getElementById(`amount-${nativeAsset}`).value;
    approveERC20("ETH", amountValue);};

   document.getElementById(`btn-supply${nativeAsset}`).onclick = function() {
     let amountValue =  document.getElementById(`amount-${nativeAsset}`).value;
     supplyETH(amountValue);};
   document.getElementById(`btn-withdraw${nativeAsset}`).onclick = function() {
     let amountValue =  document.getElementById(`amount-${nativeAsset}`).value;
     withdrawETH(amountValue);};

    
  //add onClicks
  for(let i = 0; i < _tokenArray.length; i++){
  let token = _tokenArray[i];
  let tokenId = db[network][token].id;
  document.getElementById(`btn-approve${tokenId}`).onclick = function() {
    let amountValue =  document.getElementById(`amount-${tokenId}`).value;
    approveERC20(`${tokenId}`, amountValue);};
   
  document.getElementById(`btn-supply${tokenId}`).onclick = function() {
    let amountValue =  document.getElementById(`amount-${tokenId}`).value;
    supplyERC20(`${tokenId}`, amountValue);};

  document.getElementById(`btn-withdraw${tokenId}`).onclick = function() {
    let amountValue =  document.getElementById(`amount-${tokenId}`).value;
    withdrawERC20(`${tokenId}`, amountValue);};
    if(network === "polygon"){
  document.querySelector(`#btn-buy${tokenId}`).addEventListener("click", function () {launchTransak(account, tokenId)}); 
    } else {
      document.getElementById(`btn-faucet${tokenId}`).onclick = function() {
    ERC20Faucet(`${tokenId}`, "10");};
    }
  
   
    
    getPrice(token);
    getERC20Balance(token);
    getRates(token);
    getDepositedValue(token);
  
  fillOutPopover('popover2');
  fillOutPopover('popover3');
  fillOutPopover('popover4');
  fillOutPopover('popover5');
  
  let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}
}

function fillOutPopover(name) {
  var id = '.' + name;
  var cont = popovertexts[name]
  var nodes = document.querySelectorAll(id)
  for (let i= 0; i< nodes.length; i++){
    var pop = new bootstrap.Popover(nodes[i], {
      trigger: 'focus',
      html: true,
      content: cont
    })
  }
}

  
  async function getERC20Balance(_token) {
    let contractAddress = db[network][_token].contractAddress;
    let decimals = db[network][_token].decimals;
    let id = db[network][_token].id;

    const contractCall = new ethers.Contract(
      contractAddress, 
      abis.aTokenABI, 
      provider
    );
    
    let balance = await contractCall.balanceOf(account);

    balance = ethers.utils.formatUnits( balance, decimals);
    document.getElementById(`balance-${[_token]}`).innerHTML = balance;
  }

  async function getPrice(_token){
    let assetAddress = db[network][_token].contractAddress;   
    let assetName = db[network][_token].id;

    const contractCall = new ethers.Contract(
      await getPriceOracle(), 
      abis.AaveOracle, 
      provider
    );
    
    let price = await contractCall.getAssetPrice(assetAddress);


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

  const contractCall = new ethers.Contract(
    db[network].Contracts.PoolAddressProvider, 
    abis.poolAddressProvider, 
    provider
  );
  const lendingPoolAddress = await contractCall.getPool();

  return lendingPoolAddress;
}

  //Gets priceOracle contract Address
async function getPriceOracle() {

  const contractCall = new ethers.Contract(
    db[network].Contracts.PoolAddressProvider, 
    abis.polygonPoolAddressProvider, 
    provider
  );
  const priceOracleAddress = await contractCall.getPriceOracle();

  return priceOracleAddress;
}

  //getValueSupplied on Aave
async function getDepositedValue(_token) {
  let assetAddress = db[network][_token].contractAddress;
  let assetName = db[network][_token].id;
  let decimals = db[network][_token].decimals;

  const contractCall = new ethers.Contract(
    db[network].Contracts.ProtocolDataProvider, 
    abis.AaveProtocolDataProvider, 
    provider
  );
  let subGraph = await contractCall.getUserReserveData(assetAddress, account);


  let returnVal = subGraph.currentATokenBalance;
  if(_token === "ETH")
  return returnVal / 10 ** decimals;
  else {
    document.getElementById(`deposited-${_token}`).innerHTML = returnVal  / 10 ** decimals;
  }
}

async function getRates(_token){
  
  let assetAddress = db[network][_token].contractAddress;

  const contractCall = new ethers.Contract(
    await getPoolContractAddress(), 
    abis.poolContract, 
    provider
  );
  let subGraph = await contractCall.getReserveData(assetAddress);

  let depositAPR = await (subGraph.currentLiquidityRate) / (10**27);
  let depositAPY = (((1 + (depositAPR / 31536000)) ** 31536000) - 1).toFixed(4) * 100; //secondsPerYearHardcoded
  if(_token === "ETH"){
    return depositAPY.toFixed(2);
  } else {
    document.getElementById(`interest-${_token}`).innerHTML = `${depositAPY.toFixed(2)}%`;
  }
}
 
 async function approveERC20(_token, _amount){
  let amount = _amount;
  let spender = await getPoolContractAddress();
  let tokenContract = db[network][_token].contractAddress;
  if(_token === "ETH") {
    spender = db[network].Contracts.WETHGateway;
    tokenContract = db[network][_token].aTokenAddress;
  }
  let decimals = db[network][_token].decimals;
  if (decimals === 18) {
    amount = ethers.utils.parseEther( _amount.toString() );
  } else {
    amount = amount * 10**decimals;
    amount = amount.toFixed();
  }

  const contractCall = new ethers.Contract(
    tokenContract, 
    abis.approve, 
    signer
  );
  const transaction = await contractCall.approve(spender, amount);

  await transaction.wait();
  generateCards(["WBTC", "DAI", "AAVE", "LINK", "USDC"]);
}

async function supplyERC20(_token, _amount){
  let tokenAddress = db[network][_token].contractAddress;
  let decimals = db[network][_token].decimals;
  let amount = _amount;
  if (decimals === 18) {
    amount = ethers.utils.parseEther( _amount.toString() );
  } else {
    amount = amount * 10**decimals;
    amount = amount.toFixed();
  }

  const contractCall = new ethers.Contract(
    await getPoolContractAddress(), 
    abis.poolContract, 
    signer
  );

  // asset, amount, onBehalfOf, referralCode
  const transaction = await contractCall.supply(tokenAddress, amount, account, 0);

  await transaction.wait();
  generateCards(["WBTC", "DAI", "AAVE", "LINK", "USDC"]);

}

 async function withdrawERC20(_token, _amount){
  let tokenAddress = db[network][_token].contractAddress;
  let decimals = db[network][_token].decimals;
  let amount = _amount;
  if (decimals === 18) {
    amount = ethers.utils.parseEther( _amount.toString() );
  } else {
    amount = amount * 10**decimals;
    amount = amount.toFixed();
  }

  const contractCall = new ethers.Contract(
    await getPoolContractAddress(), 
    abis.poolContract, 
    signer
  );
  const transaction = await contractCall.withdraw(tokenAddress, amount, account);

  await transaction.wait();
  generateCards(["WBTC", "DAI", "AAVE", "LINK", "USDC"]);

 }


 //DEPOSIT Native Token (not WETH)
async function supplyETH(_amount) {
  let amount = _amount * 10**18;
  amount = amount.toString();

  const contractCall = new ethers.Contract(
    db[network].Contracts.WETHGateway, 
    abis.WETHGateway, 
    signer
  );

  // pool, onBehalfOf, referralCode, msgValue
  const transaction = await contractCall.depositETH(await getPoolContractAddress(), account, 0, {value: amount});

  await transaction.wait();
  generateCards(["WBTC", "DAI", "AAVE", "LINK", "USDC"]);

}

//WITHDRAW Native Token (not WETH)
async function withdrawETH(_amount) {
  let amount = _amount * 10**18;

  const contractCall = new ethers.Contract(
    db[network].Contracts.WETHGateway, 
    abis.WETHGateway, 
    signer
  );
  // pool, amount, to
  const transaction = await contractCall.withdrawETH(await getPoolContractAddress(), amount.toString(), account);

  await transaction.wait();
  generateCards(["WBTC", "DAI", "AAVE", "LINK", "USDC"]);

}

async function ERC20Faucet(_token, _amount) {
  let decimals = db[network][_token].decimals;
  let amount = _amount;

  if (decimals === 18) {
    amount = ethers.utils.parseEther((_amount*100).toString());
    
  } else if (decimals === 6){
    amount = amount * 100 *10**decimals;  // faucet 1000 of token
  }
  else {
    amount = amount *10 * 10**decimals;  // faucet 100 of token (WBTC)
    amount = amount.toFixed();
  }

  contractAddress = db[network].Contracts.ERC20Faucet;
  tokenAddress = db[network][_token].contractAddress;

  const contractCall = new ethers.Contract(
    contractAddress, 
    abis.ERC20Faucet, 
    signer
  );

  const transaction = await contractCall.mint(tokenAddress, amount);

  await transaction.wait();
  generateCards(["WBTC", "DAI", "AAVE", "LINK", "USDC"]);
  }

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
              rpcUrls: ["https://polygon-mumbai.g.alchemy.com/v2/SqfaXTHKq6BcbY6g2ZaQ2OtxwjbsW1Wk"],
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

var popover1 = new bootstrap.Popover(document.querySelector('.popover-dismiss-1'), {
  trigger: 'focus',
  html: true,
  // title: 'Title 1',
  content: popovertexts.popover1
})


///////////////////////////
/// Light / Dark Mode  ///
/////////////////////////

$('.switch').click(()=>{

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


