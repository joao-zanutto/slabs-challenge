const ethers = require("ethers");

require("dotenv").config();

const apiKey = process.env.API_KEY;
const privateKey = process.env.PRIVATE_KEY;
const address = "0x6ab94D18784ED5020457DAe7F3EE29865a5A0CD4";

const abi = require("./artifacts/contracts/RandomNumberGenerator.sol/RandomNumberGenerator.json");
const {
  ContractType,
} = require("hardhat/internal/hardhat-network/stack-traces/model");

const provider = new ethers.providers.AlchemyProvider("maticmum", apiKey);

var wallet = new ethers.Wallet(privateKey, provider);
var contract = new ethers.Contract(address, abi.abi, wallet);
const generateRandom = async function () {
  console.log("Generating random number...");
  await contract.getRandomNumber();
  console.log("Getting user numbers...");
  var randNum = 0;
  //await contract.resetUserRequest(wallet.address);
  while (randNum == 0) {
    randNum = await contract.getUserRandomNumbers(wallet.address);
  }
  console.log("Random number: " + randNum);
};

generateRandom();
