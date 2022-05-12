/** Connect to Moralis server */
const serverUrl = "https://wiv8xlhz3p4n.usemoralis.com:2053/server";
const appId = "jvb22Emu3AzXUN1A9W6SOPNPGkPoCW4tnh5WGwhI";
Moralis.start({ serverUrl, appId });


// -----------------------
// Moralis Wallet       //
// -----------------------

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

