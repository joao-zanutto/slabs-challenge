const ethers = require("ethers");

require("dotenv").config();

const apiKey = process.env.API_KEY;
const privateKey = process.env.PRIVATE_KEY;

const provider = new ethers.providers.AlchemyProvider("maticmum", apiKey);
var wallet = new ethers.Wallet(privateKey, provider);

const {
  ContractType,
} = require("hardhat/internal/hardhat-network/stack-traces/model");

const randAddress = "0xf5159a9Da386bc6F405D56AE5EC32dCf6d1D8eed";
const erc20Address = "0xc907b1100d09561EA62c7f027fAF6C164d73E4EC";
const erc721Address = "0x3C267aC1556AB8D7442AA24e34dA16E372C73659";

const randABI = require("./artifacts/contracts/RandomNumberGenerator.sol/RandomNumberGenerator.json");
const erc20ABI = require("./artifacts/contracts/ERC20Implementation.sol/ERC20Implementation.json");
const erc721ABI = require("./artifacts/contracts/ERC721Implementation.sol/ERC721Implementation.json");

var rand = new ethers.Contract(randAddress, randABI.abi, wallet);
var erc20 = new ethers.Contract(erc20Address, erc20ABI.abi, wallet);
var erc721 = new ethers.Contract(erc721Address, erc721ABI.abi, wallet);

const generateRandom = async function () {
  try {
    await rand.getRandomNumber();
  } catch (e) {
    console.log(e);
    if (e.error.error.body.includes("Already requested random number")) {
      return 1;
    }
  }
};

const checkRandomStatus = async function (address) {
  try {
    const numbers = await rand.getUserRandomNumbers(address);
    return numbers;
  } catch (e) {
    if (e.reason.includes("Random numbers not yet fulfilled")) {
      console.log("Random numbers not yet fulfilled");
      return 1;
    }
    if (e.reason.includes("User has not requested random number")) {
      console.log("User has not requested random number");
      return 0;
    }
  }
};

const generateNFT = async function () {
  try {
    await erc721.awardItem();
    return 0;
  } catch (e) {
    console.log(e);
    if (e.error.error.body.includes("Not enough allowance")) {
      console.log("Not enough allowance");
      return 1;
    }
    if (e.error.error.body.includes("Not enough tokens")) {
      console.log("Not enough tokens");
      return 2;
    }
  }
};

//erc20.approve(erc721.address, ethers.utils.parseEther("15"));

const mintNFT = async function () {
  const requestedRand = await checkRandomStatus(wallet.address);
  if (!requestedRand) {
    await generateRandom();
  } else if (requestedRand != 1) {
    const generateStatus = await generateNFT();
    if (generateStatus == 0) {
      console.log("NFT generated");
    }
  }
};

//mintNFT();

const getMonsters = async function () {
  const monsters = await erc721.getMonsters(wallet.address);
  console.log(monsters);
  return monsters;
};

getMonsters();
