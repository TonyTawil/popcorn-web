import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import MovieGrid from "./MovieGrid";

interface SearchResultsViewProps {
  query: string;
  results: Movie[];
  isLoading: boolean;
  error: string | null;
}

export function SearchResultsView({
  query,
  results,
  isLoading,
  error,
}: SearchResultsViewProps) {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Search results for "{query}"
      </h1>
      {isLoading ? (
        <MovieGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-700 aspect-[2/3] rounded-lg"></div>
              <div className="bg-gray-700 h-4 w-3/4 mt-2 rounded"></div>
            </div>
          ))}
        </MovieGrid>
      ) : results.length === 0 ? (
        <div className="text-gray-400">No movies found</div>
      ) : (
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
      )}
    </div>
  );
}
