import { ethers } from "ethers";
import { useState, useEffect } from "react";
import MonsterGallery from "../components/MonsterGallery";

const erc20ABI = require("../../solidity/artifacts/contracts/ERC20Implementation.sol/ERC20Implementation.json");
const erc20Address = "0xc907b1100d09561EA62c7f027fAF6C164d73E4EC";

const erc721ABI = require("../../solidity/artifacts/contracts/ERC721Implementation.sol/ERC721Implementation.json");
const erc721Address = "0x3C267aC1556AB8D7442AA24e34dA16E372C73659";

export default function Home() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [erc20Contract, seterc20Contract] = useState(undefined);
  const [erc721Contract, seterc721Contract] = useState(undefined);

  const [address, setAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    if (
      typeof window.ethereum !== "undefined" ||
      typeof window.web3 !== "undefined"
    ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  useEffect(() => {
    async function getAddress() {
      if (typeof signer !== "undefined") {
        const address = await signer.getAddress();
        setAddress(address);
        seterc20Contract(
          new ethers.Contract(erc20Address, erc20ABI.abi, signer)
        );
        seterc721Contract(
          new ethers.Contract(erc721Address, erc721ABI.abi, signer)
        );
      }
    }

    getAddress();
  }, [signer]);

  useEffect(() => {
    async function getBalance() {
      if (typeof erc20Contract !== "undefined") {
        const balance = ethers.utils.formatEther(
          await erc20Contract.balanceOf(address)
        );
        setBalance(balance);
      }
    }

    getBalance();
  }, [erc20Contract]);

  useEffect(() => {
    async function getMonsters() {
      if (typeof erc721Contract !== "undefined") {
        const monsters = await erc721Contract.getMonsters(address);
        console.log(monsters);
        setMonsters(monsters);
      }
    }

    getMonsters();
  }, [erc721Contract]);

  const requestAccess = async () => {
    await provider.send("eth_requestAccounts", []);
    setSigner(provider.getSigner());
  };

  return (
    <div>
      {typeof signer !== "undefined" ? (
        <div>
          <h2>Address connected: {address}</h2>
          <p>SLBs Balance: {balance}</p>
          <MonsterGallery monsters={monsters} />
        </div>
      ) : (
        <button onClick={requestAccess}> Request access </button>
      )}
    </div>
  );
}
