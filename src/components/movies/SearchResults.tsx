import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import MovieGrid from "./MovieGrid";

interface SearchResultsProps {
  results: Movie[];
  isLoading: boolean;
  error: string | null;
}

export function SearchResults({
  results,
  isLoading,
  error,
}: SearchResultsProps) {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return (
      <MovieGrid>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-700 aspect-[2/3] rounded-lg"></div>
            <div className="bg-gray-700 h-4 w-3/4 mt-2 rounded"></div>
          </div>
        ))}
      </MovieGrid>
    );
  }

  if (results.length === 0) {
    return <div className="text-gray-400">No movies found</div>;
  }

  return (
    <MovieGrid>
      {results.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          onClick={() => (window.location.href = `/movie/${movie.id}`)}
        />
      ))}
    </MovieGrid>
  );
}
