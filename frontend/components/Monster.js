import Image from "next/image";

export default function Monster({ monster }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Image height={200} width={400} src={monster[2]} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          Monster #{monster[0].toNumber()}
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          POWER LEVEL {monster[1]}
        </span>
      </div>
    </div>
  );
}
