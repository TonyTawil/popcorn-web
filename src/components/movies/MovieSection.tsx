"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Movie } from "@/types/movie";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  category: string;
}

export default function MovieSection({
  title,
  movies,
  isLoading,
  error,
  category,
}: MovieSectionProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (error) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link
          href={`/movies/${category}`}
          className="text-primary hover:text-accent transition-colors"
        >
          See all
        </Link>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-none w-32 md:w-48 animate-pulse"
                >
                  <div className="bg-gray-700 w-full aspect-[2/3] rounded-lg"></div>
                  <div className="bg-gray-700 h-4 w-3/4 mt-2 rounded"></div>
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-none w-32 md:w-48 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredId(movie.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 128px, 192px"
                      priority={category === "trending"}
                    />
                    {hoveredId === movie.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-accent text-lg font-bold mb-2">
                            ★ {movie.vote_average.toFixed(1)}
                          </div>
                          <button
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm transition-colors"
                            onClick={() => router.push(`/movie/${movie.id}`)}
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
      </div>
    </section>
  );
}
