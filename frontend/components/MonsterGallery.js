import { useEffect, useState } from "react";
import Monster from "./Monster";

export default function MonsterGallery({ erc721Contract, userAddress }) {
  const [monsters, setMonsters] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [requestRefresh, setRequestRefresh] = useState(false);

  useEffect(() => {
    async function getMonsters() {
      if (typeof erc721Contract !== "undefined") {
        const monsters = await erc721Contract.getMonsters(userAddress);
        setMonsters(monsters);

        erc721Contract.on("MonsterCreated", (owner, monsterId) =>
          setRequestRefresh(!requestRefresh)
        );
      }
    }

    getMonsters();
  }, [erc721Contract, requestRefresh]);

  useEffect(() => {
    let sum = 0;
    monsters.forEach((monster) => (sum += monster[1]));
    setTotalPower(sum);
  }, [monsters]);

  return (
    <div>
      <span>
        {totalPower == 0 && typeof erc721Contract === "undefined"
          ? "Loading..."
          : "ACCOUNT POWER LEVEL " + totalPower}
      </span>
      <div className="flex">
        {monsters.map((monster, id) => (
          <Monster key={id} monster={monster} />
        ))}
      </div>
    </div>
  );
}
