import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";

const questionUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png";
const assembleUrl = function (id) {
  return `https://ipfs.io/ipfs/QmZWzAUMs8G7Bp9a1w8Kawu8UR71d5mipkyD9f49hsgHm3/monster-${id}.png`;
};

export default function MonsterAcademy({
  randContract,
  erc721Contract,
  userAddress,
  erc20Contract,
}) {
  const [randNumbers, setRandNumbers] = useState(undefined);
  const [randStatus, setRandStatus] = useState(undefined);
  const [requestRefresh, setRequestRefresh] = useState(false);

  useEffect(() => {
    async function checkRandomStatus() {
      try {
        if (typeof randContract !== "undefined") {
          randContract.on("RandomGenerated", (owner, values) => {
            console.log("RANDOM GENERATED" + values);
            setRequestRefresh(!requestRefresh);
          });
          const numbers = await randContract.getUserRandomNumbers(userAddress);
          setRandNumbers([numbers[0].toNumber(), numbers[1].toNumber()]);
          setRandStatus(0);
        }
      } catch (e) {
        console.log(e);
        if (e.reason.includes("Random numbers not yet fulfilled")) {
          setRandStatus(1);
        }
        if (e.reason.includes("User has not requested random number")) {
          setRandStatus(2);
        }
      }
    }

    checkRandomStatus();
  }, [randContract, requestRefresh]);

  const mintMonster = async function () {
    const allowance = await erc20Contract.approve(
      erc721Contract.address,
      ethers.utils.parseEther("15")
    );
    await allowance.wait();
    const mint = await erc721Contract.awardItem();
    await mint.wait();
    setRandStatus(2);
  };

  const generateRandom = async function () {
    await randContract.getRandomNumber();
    setRandStatus(1);
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Image
        height={200}
        width={400}
        src={randStatus === 0 ? assembleUrl(randNumbers[0]) : questionUrl}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Monster #?</div>
      </div>
      <div className="px-14">
        {randStatus === 0 ? (
          <button
            onClick={mintMonster}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
          >
            Pay 15 SLBs and Mint Monster
          </button>
        ) : randStatus === 1 ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
            disabled={true}
          >
            Generating your Monster...
          </button>
        ) : randStatus === 2 ? (
          <button
            onClick={generateRandom}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
          >
            Generate your random Monster
          </button>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          POWER LEVEL {randStatus === 0 ? randNumbers[1] : " ?"}
        </span>
      </div>
    </div>
  );
}
