import Image from "next/image";

interface MoviePosterProps {
  title: string;
  posterPath: string | null;
  className?: string;
}

export function MoviePoster({
  title,
  posterPath,
  className = "",
}: MoviePosterProps) {
  if (!posterPath) {
    return (
      <div
        className={`bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-2xl font-bold text-gray-400">
          {title
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </span>
      </div>
    );
  }

  const imageUrl = posterPath.startsWith("http")
    ? posterPath
    : `https://image.tmdb.org/t/p/w500${posterPath}`;

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
