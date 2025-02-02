"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Loader } from "@/components/ui/Loader";
import MovieSection from "@/components/movies/MovieSection";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import { MovieCard } from "@/components/movies/MovieCard";

interface TvDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  genres: { id: number; name: string }[];
  created_by: { id: number; name: string }[];
  networks: { id: number; name: string; logo_path: string }[];
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  roles: {
    character: string;
    episode_count: number;
  }[];
  total_episode_count: number;
}

interface Credits {
  cast: CastMember[];
}

export default function TvSeriesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const seriesId = params.seriesId as string;

  const [series, setSeries] = useState<TvDetails | null>(null);
  const [similarSeries, setSimilarSeries] = useState<any[]>([]);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCast, setShowAllCast] = useState(false);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [seriesRes, similarRes, creditsRes] = await Promise.all([
          fetch(`/api/tv/${seriesId}`),
          fetch(`/api/tv/${seriesId}/similar`),
          fetch(`/api/tv/${seriesId}/credits`),
        ]);

        const [seriesData, similarData, creditsData] = await Promise.all([
          seriesRes.json(),
          similarRes.json(),
          creditsRes.json(),
        ]);

        if (!seriesRes.ok)
          throw new Error(seriesData.error || "Failed to load series");
        if (!similarRes.ok) throw new Error("Failed to load similar series");
        if (!creditsRes.ok) throw new Error("Failed to load credits");

        setSeries(seriesData);
        setSimilarSeries(similarData.results);
        setCredits(creditsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (seriesId) {
      fetchSeriesDetails();
    }
  }, [seriesId]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!series) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop Image */}
      <div className="relative h-[400px] md:h-[600px]">
        <Image
          src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
          alt={series.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-64">
            <Image
              src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
              alt={series.name}
              width={256}
              height={384}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex-grow text-white">
            <h1 className="text-4xl font-bold mb-4">{series.name}</h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {series.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <StarIcon className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold">
                {series.vote_average.toFixed(1)}
              </span>
            </div>

            {/* Series Info */}
            <div className="space-y-4 mb-8">
              <p className="text-gray-300">
                First Aired:{" "}
                {new Date(series.first_air_date).toLocaleDateString()}
              </p>
              <p className="text-gray-300">
                Seasons: {series.number_of_seasons} | Episodes:{" "}
                {series.number_of_episodes}
              </p>
              <p className="text-gray-300">Status: {series.status}</p>
              {series.created_by.length > 0 && (
                <p className="text-gray-300">
                  Created by:{" "}
                  {series.created_by.map((creator) => creator.name).join(", ")}
                </p>
              )}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Overview</h2>
              <p className="text-gray-300">{series.overview}</p>
            </div>

            {/* Networks */}
            {series.networks.length > 0 && (
              <div className="flex gap-4 mb-8">
                {series.networks.map((network) => (
                  <div key={network.id} className="bg-white p-2 rounded-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${network.logo_path}`}
                      alt={network.name}
                      width={92}
                      height={45}
                      className="h-[45px] w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {credits && credits.cast.length > 0 && (
          <section className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Series Cast</h2>
              {credits.cast.length > 6 && (
                <button
                  onClick={() => setShowAllCast(!showAllCast)}
                  className="text-tv-primary hover:text-tv-primary-dark transition-colors"
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
                  <div
                    key={`${person.id}-${person.roles[0]?.character}`}
                    className="text-center"
                  >
                    <div className="relative aspect-[2/3] mb-2">
                      {person.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                          alt={person.name}
                          fill
                          className="rounded-lg object-cover"
                          sizes="(max-width: 768px) 33vw, 20vw"
                        />
                      ) : (
                        <Avatar name={person.name} />
                      )}
                    </div>
                    <h3 className="text-white font-medium text-sm truncate">
                      {person.name}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                      {person.roles[0]?.character}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {person.total_episode_count}{" "}
                      {person.total_episode_count === 1
                        ? "Episode"
                        : "Episodes"}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Similar Series */}
        {similarSeries.length > 0 && (
          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Similar Series</h2>
              <Link
                href={`/tv/${seriesId}/similar`}
                className="text-tv-primary hover:text-tv-primary-dark transition-colors"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {similarSeries.slice(0, 6).map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={item.name || item.title}
                  posterPath={item.poster_path}
                  onClick={() => router.push(`/tv/${item.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
