"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import MovieGrid from "@/components/movies/MovieGrid";
import { MovieCard } from "@/components/movies/MovieCard";
import { Loader } from "@/components/ui/Loader";
import { IMovieList } from "@/models/User";

function WatchedContent() {
  const { data: session, status } = useSession();
  const [watched, setWatched] = useState<IMovieList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatched = async () => {
      try {
        const response = await fetch("/api/watched");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch watched list");
        }

        setWatched(data.watched);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchWatched();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  const handleRemoveFromWatched = async (movieId: number) => {
    try {
      const response = await fetch("/api/watched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "remove",
          movieId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove movie");
      }

      setWatched(data.watched);
    } catch (error) {
      console.error("Failed to remove movie:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!session) {
    return (
      <div className="text-center text-gray-400 mt-8">
        <p>Please sign in to view your watched movies.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Watched Movies</h1>
      {watched.length === 0 ? (
        <p className="text-gray-400 text-center">
          No movies marked as watched yet.
        </p>
      ) : (
        <MovieGrid>
          {watched.map((movie) => (
            <MovieCard
              key={movie.movieId}
              id={movie.movieId}
              title={movie.title}
              posterPath={movie.coverImage}
              onRemove={() => handleRemoveFromWatched(movie.movieId)}
              listType="watched"
            />
          ))}
        </MovieGrid>
      )}
    </div>
  );
}

export default function WatchedPage() {
  return (
    <Suspense fallback={<Loader />}>
      <WatchedContent />
    </Suspense>
  );
}
