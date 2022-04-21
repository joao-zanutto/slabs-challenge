import { ethers } from "ethers";
import { useState, useEffect } from "react";
import MonsterGallery from "../components/MonsterGallery";
import Balance from "../components/Balance";
import MonsterAcademy from "../components/MonsterAcademy";
import * as contracts from "../config/.contracts.js";
import erc20ABI from "../config/ERC20Implementation.json";
import erc721ABI from "../config/ERC721Implementation.json";
import randABI from "../config/RandomNumberGenerator.json";

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
          new ethers.Contract(
            contracts.ERC20_CONTRACT_ADDRESS,
            erc20ABI.abi,
            signer
          )
        );
        seterc721Contract(
          new ethers.Contract(
            contracts.ERC721_CONTRACT_ADDRESS,
            erc721ABI.abi,
            signer
          )
        );
        setRandContract(
          new ethers.Contract(
            contracts.RAN_GENERATOR_ADDRESS,
            randABI.abi,
            signer
          )
        );
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
