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
          console.log(user);
          console.log(user.get('ethAddress'));
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

//First: gets the current pool contract address (sometimes it changes)
async function getPoolContractAddress() {
const options = {
  chain: "rinkeby",
  address: "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C",
  function_name: "getPool",
  abi: abis.poolAddressProvider,
  params: { },
};
 const lendingPoolAddress = await Moralis.Web3API.native.runContractFunction(options);
 console.log(`Current Rinkeby aave-pool-contract address: ${lendingPoolAddress}`);
//Second: Instantiate pool contract to easily call functions
// const lendingPoolInstance = new web3.eth.Contract(lendingPoolABI, lendingPoolAddress)
//WIP - Mark
////////////////////////////////
}
document.getElementById("btn-getPool").onclick = getPoolContractAddress;

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

document.getElementById("btn-depositEth").onclick = depositToAave;



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