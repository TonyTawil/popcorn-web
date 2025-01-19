"use client";

import Image from "next/image";
import type { Movie } from "@/types/movie";

export interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (movieId: number) => void;
}

export default function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative aspect-[2/3] cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onMovieClick?.(movie.id)}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-75 transition-opacity duration-300 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="text-center p-4">
              <div className="text-accent text-lg font-bold mb-2">
                ★ {movie.vote_average.toFixed(1)}
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm transition-colors">
                View Details
              </button>
            </div>
          </div>
          <h3 className="text-white mt-2 text-sm font-medium truncate">
            {movie.title}
          </h3>
        </div>
      ))}
    </div>
  );
}
