import Monster from "./Monster";

export default function MonsterGallery({ monsters }) {
  return (
    <div>
      {monsters.map((monster, id) => (
        <Monster key={id} monster={monster} />
      ))}
    </div>
  );
}
