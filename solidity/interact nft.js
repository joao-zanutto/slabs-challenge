const ethers = require("ethers");

require("dotenv").config();

const apiKey = process.env.API_KEY;
const privateKey = process.env.PRIVATE_KEY;
const address = "0xf6b561CD544D68117B8a767D9aB5dD3Dc3e2bf63";

const abi = require("./artifacts/contracts/ERC721Implementation.sol/ERC721Implementation.json");
const {
  ContractType,
} = require("hardhat/internal/hardhat-network/stack-traces/model");

const provider = new ethers.providers.AlchemyProvider("maticmum", apiKey);

var wallet = new ethers.Wallet(privateKey, provider);
var contract = new ethers.Contract(address, abi.abi, wallet);
const mintToken = async function () {
  //await contract.awardItem("0xDE198d278A7DF40e23B378168a8dEA89EF03649E");
  console.log(
    await contract.getMonsters("0xDE198d278A7DF40e23B378168a8dEA89EF03649E")
  );
};

mintToken();
