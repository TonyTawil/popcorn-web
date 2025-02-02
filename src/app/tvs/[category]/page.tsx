"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MovieGrid from "@/components/movies/MovieGrid";
import MovieGridSkeleton from "@/components/loading/MovieGridSkeleton";
import { MovieCard } from "@/components/movies/MovieCard";
import { Loader } from "@/components/ui/Loader";
import type { TvShow } from "@/types/tmdb";
import { useSession } from "next-auth/react";

type CategoryTitles = {
  [key: string]: string;
  trending: string;
  airing_today: string;
  popular: string;
  top_rated: string;
};

const categoryTitles: CategoryTitles = {
  trending: "Trending TV Shows",
  airing_today: "Airing Today",
  popular: "Popular Shows",
  top_rated: "Top Rated Shows",
};

export default function AllTvPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const session = useSession();

  const [items, setItems] = useState<TvShow[]>([]);
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
        const res = await fetch(`/api/tv?type=${category}&page=${page}`, {
          method: "GET",
        });
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
  }, [category, page]);

  const handleShowClick = (showId: number) => {
    router.push(`/tv/${showId}`);
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
            {items.map((show) => (
              <MovieCard
                key={show.id}
                id={show.id}
                title={show.name}
                posterPath={show.poster_path}
                onClick={() => handleShowClick(show.id)}
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
                <div className="w-5 h-5 border-2 border-tv-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-tv-primary">Loading...</span>
              </div>
            ) : (
              <button
                onClick={loadMore}
                className="bg-tv-primary hover:bg-tv-primary-dark text-white px-6 py-2 rounded-full transition-colors"
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
