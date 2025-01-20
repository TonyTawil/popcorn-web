"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MovieGrid from "@/components/movies/MovieGrid";
import MovieGridSkeleton from "@/components/loading/MovieGridSkeleton";
import { MovieCard } from "@/components/movies/MovieCard";
import { Loader } from "@/components/ui/Loader";
import type { Movie } from "@/types/movie";
import { useSession } from "next-auth/react";

type CategoryTitles = {
  [key: string]: string;
  trending: string;
  now_playing: string;
  upcoming: string;
};

const categoryTitles: CategoryTitles = {
  trending: "Trending Movies",
  now_playing: "Now Playing",
  upcoming: "Upcoming Movies",
};

export default function AllMoviesPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const session = useSession();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoryTitle = category ? categoryTitles[category] : "";

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/movies?type=${category}&page=${page}`, {
          method: "GET",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load movies");
        }

        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movies");
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      loadMovies();
    }
  }, [category, page]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const loadMore = () => {
    if (page < totalPages) {
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>

        {!isLoading && movies.length > 0 && (
          <MovieGrid>
            {movies.map((movie) => (
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
        {isLoading && <MovieGridSkeleton count={20} />}
        {error && (
          <div className="text-red-500 text-center mt-4 p-4 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}

        {page < totalPages && !isLoading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
