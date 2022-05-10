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

async function donate() {

  let options = {
    contractAddress: "0x356d2E7a0d592bAd95E86d19479c37cfdBb68Ab9",
    functionName: "newDonation",
    abi: [{
        "inputs": [
          { "internalType": "string", "name": "note", "type": "string" },
        ],
        "name": "newDonation",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
      }],
    params: {
      note: "Thanks for your work",
    },
    msgValue: Moralis.Units.ETH(0.01),
  };


  await Moralis.executeFunction(options);
  // await Moralis.User.logOut();
  // console.log("logged out");
  console.log("donated!");
}

document.getElementById("btn-donate").onclick = donate;


// -----------------------
// Aave Connect         //
// -----------------------





// -----------------------
// Transak              //
// -----------------------