"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import MovieGrid from "@/components/movies/MovieGrid";
import MovieGridSkeleton from "@/components/loading/MovieGridSkeleton";
import type { Movie } from "@/types/movie";
import Avatar from "@/components/ui/Avatar";
import { MovieCard } from "@/components/movies/MovieCard";
import { Loader } from "@/components/ui/Loader";

interface MovieDetails extends Movie {
  backdrop_path: string;
  overview: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  key: string;
  name: string;
  site: string;
  type: string;
}

interface MovieData {
  movie: MovieDetails;
  credits: { cast: Cast[] };
  similar: { results: Movie[] };
  videos: { results: Video[] };
}

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showAllCast, setShowAllCast] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch movie details");
        }

        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch("/api/watchlist");
        const data = await res.json();

        if (res.ok) {
          setIsInWatchlist(
            data.watchList.some(
              (movie: any) => movie.movieId === Number(movieId)
            )
          );
        }
      } catch (err) {
        console.error("Error checking watchlist:", err);
      }
    };

    checkWatchlist();
  }, [session, movieId]);

  const handleWatchlistToggle = async () => {
    if (!session) {
      // Redirect to login page with return URL
      router.push(`/login?returnUrl=/movie/${movieId}`);
      return;
    }

    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: isInWatchlist ? "remove" : "add",
          movieId: Number(movieId),
          title: data?.movie.title,
          coverImage: data?.movie.poster_path,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update watchlist");
      }

      setIsInWatchlist(!isInWatchlist);
    } catch (err) {
      console.error("Error updating watchlist:", err);
      // You might want to show an error toast/notification here
    }
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse bg-gray-800 h-[400px] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 w-1/3 rounded" />
            <div className="h-4 bg-gray-800 w-1/4 rounded" />
            <div className="h-4 bg-gray-800 w-full rounded" />
            <div className="h-4 bg-gray-800 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500 text-xl">
          {error || "Failed to load movie"}
        </div>
      </div>
    );
  }

  const { movie, credits, similar, videos } = data;
  const trailer = videos.results.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.name.toLowerCase().includes("official")
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop */}
      <div className="relative h-[400px] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="relative w-64 aspect-[2/3] flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-300 mb-6">
              <span>★ {movie.vote_average.toFixed(1)}</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>

            <div className="flex gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 mb-6">{movie.overview}</p>

            <div className="flex gap-4">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors"
                >
                  Watch Trailer
                </a>
              )}

              <button
                onClick={handleWatchlistToggle}
                className="border border-primary hover:bg-primary/10 text-primary px-6 py-2 rounded-full transition-colors"
              >
                {session
                  ? isInWatchlist
                    ? "Remove from Watchlist"
                    : "Add to Watchlist"
                  : "Sign in to add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Cast</h2>
            {credits.cast.length > 6 && (
              <button
                onClick={() => setShowAllCast(!showAllCast)}
                className="text-primary hover:text-accent transition-colors"
              >
                {showAllCast ? "Show Less" : "See All"}
              </button>
            )}
          </div>
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${
              !showAllCast && "max-h-[400px] overflow-hidden"
            }`}
          >
            {(showAllCast ? credits.cast : credits.cast.slice(0, 6)).map(
              (person) => (
                <div key={person.id} className="text-center">
                  <div className="relative aspect-[2/3] mb-2">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                        alt={person.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <Avatar name={person.name} />
                    )}
                  </div>
                  <h3 className="text-white font-medium truncate">
                    {person.name}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {person.character}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Similar Movies */}
        {similar.results.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Similar Movies
            </h2>
            <MovieGrid>
              {similar.results.slice(0, 5).map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </MovieGrid>
          </section>
        )}
      </div>
    </div>
  );
}
