import Image from "next/image";

export default function Monster({ monster }) {
  return (
    <div>
      <h2> {monster[0].toNumber()} </h2>
      <Image width={100} height={100} src={monster[2]} />
      <h4> Power level: {monster[1]}</h4>
    </div>
  );
}
