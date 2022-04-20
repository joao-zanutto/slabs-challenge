import { useEffect, useState } from "react";
import Monster from "./Monster";

export default function MonsterGallery({ erc721Contract, userAddress }) {
  const [monsters, setMonsters] = useState([]);
  const [totalPower, setTotalPower] = useState(0);

  useEffect(() => {
    async function getMonsters() {
      if (typeof erc721Contract !== "undefined") {
        const monsters = await erc721Contract.getMonsters(userAddress);
        setMonsters(monsters);
      }
    }

    getMonsters();
  }, [erc721Contract]);

  useEffect(() => {
    let sum = 0;
    monsters.forEach((monster) => (sum += monster[1]));
    setTotalPower(sum);
  }, [monsters]);

  return (
    <div>
      <span>
        {totalPower == 0 ? "Loading..." : "ACCOUNT POWER LEVEL " + totalPower}
      </span>
      <div className="flex">
        {monsters.map((monster, id) => (
          <Monster key={id} monster={monster} />
        ))}
      </div>
    </div>
  );
}
