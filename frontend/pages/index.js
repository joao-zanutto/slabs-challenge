import { ethers } from "ethers";
import { useState, useEffect } from "react";
import MonsterGallery from "../components/MonsterGallery";
import Balance from "../components/Balance";
import MonsterAcademy from "../components/MonsterAcademy";

const erc20ABI = require("../../solidity/artifacts/contracts/ERC20Implementation.sol/ERC20Implementation.json");
const erc20Address = "0xc907b1100d09561EA62c7f027fAF6C164d73E4EC";

const erc721ABI = require("../../solidity/artifacts/contracts/ERC721Implementation.sol/ERC721Implementation.json");
const erc721Address = "0x3C267aC1556AB8D7442AA24e34dA16E372C73659";

const randABI = require("../../solidity/artifacts/contracts/RandomNumberGenerator.sol/RandomNumberGenerator.json");
const randAddress = "0xf5159a9Da386bc6F405D56AE5EC32dCf6d1D8eed";

export default function Home() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [erc20Contract, seterc20Contract] = useState(undefined);
  const [erc721Contract, seterc721Contract] = useState(undefined);
  const [randContract, setRandContract] = useState(undefined);

  const [address, setAddress] = useState(undefined);

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
        setRandContract(new ethers.Contract(randAddress, randABI.abi, signer));
      }
    }

    getAddress();
  }, [signer]);

  const requestAccess = async () => {
    await provider.send("eth_requestAccounts", []);
    setSigner(provider.getSigner());
  };

  return (
    <div>
      {typeof signer !== "undefined" ? (
        <div>
          <h2>Address connected: {address}</h2>
          <Balance erc20Contract={erc20Contract} userAddress={address} />
          <MonsterAcademy
            randContract={randContract}
            erc721Contract={erc721Contract}
            erc20Contract={erc20Contract}
            userAddress={address}
          />
          <h2 className="font-bold text-xl mb-2"> Monster Gallery </h2>
          <MonsterGallery
            erc721Contract={erc721Contract}
            userAddress={address}
          />
        </div>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={requestAccess}
        >
          Connect with Metamask
        </button>
      )}
    </div>
  );
}
