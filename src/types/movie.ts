export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieListItem {
  movieId: number;
  title: string;
  posterPath: string;
  addedAt: Date;
}

export interface WatchlistMovie extends MovieListItem {}
export interface WatchedMovie extends MovieListItem {} 