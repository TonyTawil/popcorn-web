export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

export interface TvShow {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface TMDBResponse {
  page: number;
  results: (Movie | TvShow)[];
  total_pages: number;
  total_results: number;
} 