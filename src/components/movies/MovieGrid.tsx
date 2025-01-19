"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleViewDetails = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative transition-transform duration-300 hover:scale-105"
          onMouseEnter={() => setHoveredId(movie.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative aspect-[2/3]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
            {hoveredId === movie.id && (
              <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-accent text-lg font-bold mb-2">
                    ★ {movie.vote_average.toFixed(1)}
                  </div>
                  <button
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm"
                    onClick={() => handleViewDetails(movie.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
          <h3 className="text-white mt-2 text-sm font-medium truncate">
            {movie.title}
          </h3>
        </div>
      ))}
    </div>
  );
}
