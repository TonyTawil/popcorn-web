export default function Avatar({ name }: { name: string }) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
      <span className="text-2xl font-bold text-gray-400">{initials}</span>
    </div>
  );
}
