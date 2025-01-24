import { useState, useEffect } from 'react';
import { Movie, TMDBResponse } from '@/types/movie';

export function useMovieSearch(query: string) {
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/movies/search?query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error('Failed to search movies');
        }

        const data: TMDBResponse = await response.json();
        setResults(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return { results, isLoading, error };
} 