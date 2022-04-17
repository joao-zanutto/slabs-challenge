export default function MonsterGallery({ monsters }) {
  return (
    <div>
      {monsters.map((monster) => (
        <Monster monster={monster} />
      ))}
    </div>
  );
}
