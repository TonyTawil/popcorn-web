"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import MovieGridSkeleton from "@/components/loading/MovieGridSkeleton";

interface WatchlistMovie {
  movieId: number;
  title: string;
  coverImage: string;
}

export default function WatchlistPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/login?returnUrl=/watchlist");
    },
  });
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      console.log("Session status:", status);
      console.log("Session data:", session);

      try {
        const res = await fetch("/api/watchlist", {
          headers: {
            "Content-Type": "application/json",
            ...(session?.user && {
              Authorization: `Bearer ${session.user.id}`,
            }),
          },
          credentials: "include",
        });

        console.log("Watchlist response status:", res.status);
        const data = await res.json();
        console.log("Watchlist response data:", data);

        if (res.status === 401) {
          router.replace("/login?returnUrl=/watchlist");
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch watchlist");
        }

        setMovies(data.watchList);
      } catch (err) {
        console.error("Fetch watchlist error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      fetchWatchlist();
    }
  }, [status, session, router]);

  const handleRemoveFromWatchlist = async (movieId: number) => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: "remove",
          movieId,
        }),
      });

      if (res.status === 401) {
        router.replace("/login?returnUrl=/watchlist");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove from watchlist");
      }

      // Remove movie from local state
      setMovies((prev) => prev.filter((movie) => movie.movieId !== movieId));
    } catch (err) {
      console.error("Error removing from watchlist:", err);
      // You might want to show an error toast/notification here
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">My Watchlist</h1>
          <MovieGridSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">My Watchlist</h1>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              Your watchlist is empty
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.movieId}
                className="relative aspect-[2/3] group cursor-pointer"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.coverImage}`}
                  alt={movie.title}
                  fill
                  className="rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-opacity duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center p-4">
                    <button
                      onClick={() => router.push(`/movie/${movie.movieId}`)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm mb-2 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveFromWatchlist(movie.movieId)}
                      className="block w-full border border-primary hover:bg-primary/10 text-primary px-4 py-2 rounded-full text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <h3 className="text-white mt-2 text-sm font-medium truncate">
                  {movie.title}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
