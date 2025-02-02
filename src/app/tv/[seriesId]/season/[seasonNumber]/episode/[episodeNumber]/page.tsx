"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { StarIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Loader } from "@/components/ui/Loader";
import Avatar from "@/components/ui/Avatar";

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface GuestStar {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface EpisodeDetails {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  runtime: number | null;
  credits: {
    crew: CrewMember[];
    guest_stars: GuestStar[];
  };
}

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { seriesId, seasonNumber, episodeNumber } = params;

  const [episode, setEpisode] = useState<EpisodeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tv/${seriesId}/seasons/${seasonNumber}/episodes/${episodeNumber}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load episode");

        setEpisode(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (seriesId && seasonNumber && episodeNumber) {
      fetchEpisodeDetails();
    }
  }, [seriesId, seasonNumber, episodeNumber]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!episode) return null;

  const director = episode.credits.crew.find((crew) => crew.job === "Director");
  const writers = episode.credits.crew.filter((crew) => crew.job === "Writer");

  return (
    <div className="min-h-screen bg-background">
      {/* Episode Still Banner */}
      <div className="relative h-[400px] md:h-[600px]">
        <Image
          src={
            episode.still_path
              ? `https://image.tmdb.org/t/p/original${episode.still_path}`
              : "/placeholder-episode.jpg" // You'll need to add a placeholder image
          }
          alt={episode.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-tv-primary hover:text-tv-primary-dark transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Season</span>
        </button>

        {/* Episode Details */}
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-2">
            {episode.episode_number}. {episode.name}
          </h1>

          <div className="flex items-center gap-4 text-gray-300 mb-6">
            <div className="flex items-center gap-1">
              <StarIcon className="w-5 h-5 text-yellow-500" />
              <span>{episode.vote_average.toFixed(1)}</span>
            </div>
            <span>{new Date(episode.air_date).toLocaleDateString()}</span>
            {episode.runtime && <span>{episode.runtime} min</span>}
          </div>

          <p className="text-gray-300 mb-8">{episode.overview}</p>

          {/* Crew Section */}
          {(director || writers.length > 0) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Crew</h2>
              <div className="space-y-2">
                {director && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12">
                      {director.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                          alt={director.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <Avatar name={director.name} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{director.name}</p>
                      <p className="text-sm text-gray-400">Director</p>
                    </div>
                  </div>
                )}
                {writers.map((writer) => (
                  <div key={writer.id} className="flex items-center gap-4">
                    <div className="w-12 h-12">
                      {writer.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${writer.profile_path}`}
                          alt={writer.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <Avatar name={writer.name} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{writer.name}</p>
                      <p className="text-sm text-gray-400">Writer</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guest Stars */}
          {episode.credits.guest_stars.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Guest Stars</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {episode.credits.guest_stars.map((star) => (
                  <div key={star.id} className="text-center">
                    <div className="relative aspect-[2/3] mb-2">
                      {star.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${star.profile_path}`}
                          alt={star.name}
                          fill
                          className="rounded-lg object-cover"
                          sizes="(max-width: 768px) 33vw, 20vw"
                        />
                      ) : (
                        <Avatar name={star.name} />
                      )}
                    </div>
                    <h3 className="font-medium text-sm truncate">
                      {star.name}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                      {star.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
