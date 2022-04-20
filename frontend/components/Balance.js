import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function MonsterGallery({ erc20Contract, userAddress }) {
  const [balance, setBalance] = useState(undefined);

  useEffect(() => {
    async function getBalance() {
      if (typeof erc20Contract !== "undefined") {
        const balance = ethers.utils.formatEther(
          await erc20Contract.balanceOf(userAddress)
        );
        setBalance(balance);
      }
    }

    getBalance();
  }, [erc20Contract]);

  return <p>SLBs Balance: {balance}</p>;
}
