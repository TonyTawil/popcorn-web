"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Movie, TvShow } from "@/types/tmdb";
import { useMode } from "@/contexts/ModeContext";

interface MovieSectionProps {
  title: string;
  items: (Movie | TvShow)[];
  isLoading: boolean;
  error: string | null;
  category: string;
}

export default function MovieSection({
  title,
  items = [],
  isLoading,
  error,
  category,
}: MovieSectionProps) {
  const router = useRouter();
  const { mode } = useMode();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getTitle = (item: Movie | TvShow) => {
    return "title" in item ? item.title : item.name;
  };

  const getDetailsPath = (item: Movie | TvShow) => {
    return mode === "movies" ? `/movie/${item.id}` : `/tv/${item.id}`;
  };

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
        <h2 className="text-2xl font-bold text-white mb-8">{title}</h2>
        <Link
          href={`/${mode === "movies" ? "movies" : "tvs"}/${category}`}
          className={`transition-colors ${
            mode === "movies"
              ? "text-primary hover:text-primary-dark"
              : "text-tv-primary hover:text-tv-primary-dark"
          }`}
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
            : (items || []).map((item) => (
                <div
                  key={item.id}
                  className="flex-none w-32 md:w-48 transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={getTitle(item)}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 128px, 192px"
                      priority={category === "trending"}
                    />
                    {hoveredId === item.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-accent text-lg font-bold mb-2">
                            ★ {item.vote_average.toFixed(1)}
                          </div>
                          <button
                            className={`transition-colors ${
                              mode === "movies"
                                ? "bg-primary hover:bg-primary-dark"
                                : "bg-tv-primary hover:bg-tv-primary-dark"
                            } text-white px-4 py-2 rounded-full text-sm`}
                            onClick={() => router.push(getDetailsPath(item))}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white mt-2 text-sm font-medium truncate">
                    {getTitle(item)}
                  </h3>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
