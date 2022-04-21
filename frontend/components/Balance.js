import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Balance({
  erc20Contract,
  userAddress,
  erc721Contract,
}) {
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

  const requestDonation = async function () {
    await erc721Contract.donateTokens(userAddress);
  };

  return (
    <div>
      {typeof balance !== "undefined" ? (
        <div className="flex">
          <p className="my-5 mr-5">SLBs Balance: {balance}</p>
          <button
            onClick={requestDonation}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
          >
            Request SLB tokens
          </button>
        </div>
      ) : (
        <p>Loading balance...</p>
      )}
    </div>
  );
}
