"use client";

import { useEffect, useState } from "react";
import MovieSection from "@/components/movies/MovieSection";
import { useMode } from "@/contexts/ModeContext";

export default function HomePage() {
  const { mode } = useMode();
  const [sections, setSections] = useState({
    trending: { items: [], isLoading: true, error: null },
    nowPlaying: { items: [], isLoading: true, error: null },
    upcoming: { items: [], isLoading: true, error: null },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, secondaryRes, tertiaryRes] = await Promise.all([
          fetch(`/api/movies?type=trending&mode=${mode}`),
          fetch(
            `/api/movies?type=${
              mode === "movies" ? "now_playing" : "airing_today"
            }&mode=${mode}`
          ),
          fetch(
            `/api/movies?type=${
              mode === "movies" ? "upcoming" : "top_rated"
            }&mode=${mode}`
          ),
        ]);

        const [trending, secondary, tertiary] = await Promise.all([
          trendingRes.json(),
          secondaryRes.json(),
          tertiaryRes.json(),
        ]);

        setSections({
          trending: { items: trending.results, isLoading: false, error: null },
          nowPlaying: {
            items: secondary.results,
            isLoading: false,
            error: null,
          },
          upcoming: { items: tertiary.results, isLoading: false, error: null },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [mode]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <MovieSection
          title="Trending"
          items={sections.trending.items}
          isLoading={sections.trending.isLoading}
          error={sections.trending.error}
          category="trending"
        />
        <MovieSection
          title={mode === "movies" ? "Now Playing" : "Airing Today"}
          items={sections.nowPlaying.items}
          isLoading={sections.nowPlaying.isLoading}
          error={sections.nowPlaying.error}
          category={mode === "movies" ? "now_playing" : "airing_today"}
        />
        <MovieSection
          title={mode === "movies" ? "Upcoming" : "Top Rated"}
          items={sections.upcoming.items}
          isLoading={sections.upcoming.isLoading}
          error={sections.upcoming.error}
          category={mode === "movies" ? "upcoming" : "top_rated"}
        />
      </div>
    </main>
  );
}
