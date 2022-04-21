import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function MonsterGallery({ erc20Contract, userAddress }) {
  const [balance, setBalance] = useState(undefined);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getBalance() {
      if (typeof erc20Contract !== "undefined") {
        const balance = ethers.utils.formatEther(
          await erc20Contract.balanceOf(userAddress)
        );
        setBalance(balance);

        erc20Contract.on("Transfer", (from, to, value) => setRefresh(!refresh));
      }
    }

    getBalance();
  }, [erc20Contract, refresh]);

  return <p>SLBs Balance: {balance}</p>;
}
