export default function Toolbar() {
  return (
    <div className="h-14 border-b border-gray-200 flex items-center gap-5 px-5">
      <input type="checkbox" className="w-4 h-4" />

      <button className="text-xl text-gray-600 hover:text-black">↻</button>

      <button className="text-xl text-gray-600 hover:text-black">⋮</button>
    </div>
  );
}
