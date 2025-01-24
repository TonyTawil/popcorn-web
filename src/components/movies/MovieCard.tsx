import { useSession } from "next-auth/react";
import { XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { MoviePoster } from "./MoviePoster";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  onRemove?: () => void;
  onClick?: () => void;
  listType?: "watchlist" | "watched";
  onAddToWatched?: () => void;
  isInWatched?: boolean;
}

export function MovieCard({
  id,
  title,
  posterPath,
  onRemove,
  onClick,
  listType = "watchlist",
  onAddToWatched,
  isInWatched,
}: MovieCardProps) {
  const { data: session } = useSession();

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) return;

    try {
      const endpoint =
        listType === "watched" ? "/api/watched" : "/api/watchlist";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "remove",
          movieId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove movie");
      }

      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error("Error removing movie:", error);
    }
  };

  const handleAddToWatched = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session || !onAddToWatched) return;
    onAddToWatched();
  };

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
        <MoviePoster
          title={title}
          posterPath={posterPath}
          className="w-full h-full transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          {onRemove && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          )}
          {!isInWatched && onAddToWatched && (
            <button
              onClick={handleAddToWatched}
              className="absolute top-2 left-2 p-1.5 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              title="Mark as watched"
            >
              <EyeIcon className="h-5 w-5 text-white" />
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-medium text-sm line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
