"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MovieGrid from "@/components/movies/MovieGrid";
import MovieGridSkeleton from "@/components/loading/MovieGridSkeleton";
import { MovieCard } from "@/components/movies/MovieCard";
import { Loader } from "@/components/ui/Loader";
import type { Movie } from "@/types/movie";
import { useSession } from "next-auth/react";
import { useMode } from "@/contexts/ModeContext";

type CategoryTitles = {
  [key: string]: string;

  // Movie categories
  trending: string;
  now_playing: string;
  upcoming: string;
  // TV categories
  airing_today: string;
  popular: string;
  top_rated: string;
};

const categoryTitles: CategoryTitles = {
  // Movie categories
  trending: "Trending",
  now_playing: "Now Playing",
  upcoming: "Upcoming",
  // TV categories
  airing_today: "Airing Today",
  popular: "Popular Shows",
  top_rated: "Top Rated",
};

export default function AllMoviesPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const session = useSession();
  const { mode } = useMode();

  const [items, setItems] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoryTitle = category ? categoryTitles[category] : "";

  useEffect(() => {
    const loadItems = async () => {
      if (page === 1) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const res = await fetch(
          `/api/movies?type=${category}&page=${page}&mode=${mode}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load content");
        }

        setItems((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    if (category) {
      loadItems();
    }
  }, [category, page, mode]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const loadMore = () => {
    if (page < totalPages) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  if (!category || !categoryTitles[category]) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500 text-xl">Invalid category</div>
      </div>
    );
  }

  if (isLoading && page === 1) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>

        {items.length > 0 && (
          <MovieGrid>
            {items.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                onClick={() => handleMovieClick(movie.id)}
                onAddToWatched={async () => {
                  if (!session) {
                    router.push("/login");
                    return;
                  }
                  const res = await fetch("/api/watched", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      type: "add",
                      movieId: movie.id,
                      title: movie.title,
                      coverImage: movie.poster_path,
                    }),
                  });
                  if (res.ok) {
                    // You might want to show a success toast here
                  }
                }}
              />
            ))}
          </MovieGrid>
        )}

        {isLoading && page === 1 && <MovieGridSkeleton count={20} />}

        {error && (
          <div className="text-red-500 text-center mt-4 p-4 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}

        {page < totalPages && !isLoading && (
          <div className="flex justify-center mt-8">
            {isLoadingMore ? (
              <div className="flex items-center gap-2 px-6 py-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-primary">Loading...</span>
              </div>
            ) : (
              <button
                onClick={loadMore}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
