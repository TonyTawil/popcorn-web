"use client";

import { useState } from "react";
import { useMovieSearch } from "@/hooks/useMovieSearch";
import { SearchResults } from "@/components/movies/SearchResults";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { results, isLoading, error } = useMovieSearch(searchQuery);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xl px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary"
        />
      </div>

      <SearchResults results={results} isLoading={isLoading} error={error} />
    </div>
  );
}
