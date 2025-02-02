"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Loader } from "@/components/ui/Loader";
import MovieSection from "@/components/movies/MovieSection";

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

export default function TvSeriesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const seriesId = params.seriesId as string;

  const [series, setSeries] = useState<TvDetails | null>(null);
  const [similarSeries, setSimilarSeries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [seriesRes, similarRes] = await Promise.all([
          fetch(`/api/tv/${seriesId}`),
          fetch(`/api/tv/${seriesId}/similar`),
        ]);

        const [seriesData, similarData] = await Promise.all([
          seriesRes.json(),
          similarRes.json(),
        ]);

        if (!seriesRes.ok)
          throw new Error(seriesData.error || "Failed to load series");
        if (!similarRes.ok) throw new Error("Failed to load similar series");

        setSeries(seriesData);
        setSimilarSeries(similarData.results);
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

        {/* Similar Series */}
        {similarSeries.length > 0 && (
          <div className="mt-16">
            <MovieSection
              title="Similar Series"
              items={similarSeries}
              isLoading={false}
              error={null}
              category="similar"
            />
          </div>
        )}
      </div>
    </div>
  );
}
