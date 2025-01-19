import MovieSection from "@/components/movies/MovieSection";
import { getTrending, getMoviesByType } from "@/lib/tmdb";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  try {
    const [trending, nowPlaying, upcoming] = await Promise.all([
      getTrending(),
      getMoviesByType("now_playing"),
      getMoviesByType("upcoming"),
    ]);

    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <MovieSection
              title="Trending Movies"
              movies={trending.results}
              isLoading={false}
              error={null}
              category="trending"
            />
            <MovieSection
              title="Now Playing"
              movies={nowPlaying.results}
              isLoading={false}
              error={null}
              category="now_playing"
            />
            <MovieSection
              title="Upcoming Movies"
              movies={upcoming.results}
              isLoading={false}
              error={null}
              category="upcoming"
            />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading homepage:", error);
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">
            Failed to load movies. Please try again later.
          </div>
        </div>
      </main>
    );
  }
}
