"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Loader } from "@/components/ui/Loader";

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  runtime: number | null;
}

interface SeasonDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  season_number: number;
  episodes: Episode[];
}

export default function SeasonPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const seriesId = params.seriesId as string;
  const seasonNumber = params.seasonNumber as string;

  const [season, setSeason] = useState<SeasonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tv/${seriesId}/seasons/${seasonNumber}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load season");

        setSeason(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (seriesId && seasonNumber) {
      fetchSeasonDetails();
    }
  }, [seriesId, seasonNumber]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!season) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Season Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Season Poster */}
          {season.poster_path && (
            <div className="flex-shrink-0 w-64">
              <Image
                src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                alt={season.name}
                width={256}
                height={384}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          )}

          {/* Season Details */}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-white mb-4">
              {season.name}
            </h1>
            {season.air_date && (
              <p className="text-gray-300 mb-4">
                Air Date: {new Date(season.air_date).toLocaleDateString()}
              </p>
            )}
            {season.overview && (
              <p className="text-gray-300 mb-6">{season.overview}</p>
            )}
          </div>
        </div>

        {/* Episodes List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
          <div className="space-y-4">
            {season.episodes.map((episode) => (
              <div
                key={episode.id}
                className="bg-gray-800/50 rounded-lg overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Episode Still */}
                  {episode.still_path && (
                    <div className="md:w-64 flex-shrink-0">
                      <div className="relative aspect-video">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                          alt={episode.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Episode Details */}
                  <div className="p-4 flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">
                        {episode.episode_number}. {episode.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-5 h-5 text-yellow-500" />
                        <span className="text-white">
                          {episode.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {episode.air_date && (
                      <p className="text-sm text-gray-400 mb-2">
                        {new Date(episode.air_date).toLocaleDateString()}
                        {episode.runtime && ` • ${episode.runtime} min`}
                      </p>
                    )}
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {episode.overview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
