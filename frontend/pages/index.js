import Monster from "../components/Monster";
import styles from "../styles/Home.module.css";
import { ethers, providers } from "ethers";
import { useState, useEffect } from "react";

const erc20ABI = require("../../solidity/artifacts/contracts/ERC20Implementation.sol/ERC20Implementation.json");
const erc20Address = "0xc907b1100d09561EA62c7f027fAF6C164d73E4EC";

export default function Home() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [erc20Contract, seterc20Contract] = useState(undefined);

  const [address, setAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

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
        </div>
      ) : (
        <button onClick={requestAccess}> Request access </button>
      )}
    </div>
  );
}
