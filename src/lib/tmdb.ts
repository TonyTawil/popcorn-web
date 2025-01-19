import axios from "axios";
import type { TMDBResponse } from "@/types/movie";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getTrending(page = 1): Promise<TMDBResponse> {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw new Error("Failed to fetch trending movies");
  }
}

export async function getMoviesByType(type: string, page = 1): Promise<TMDBResponse> {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${type}?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} movies:`, error);
    throw new Error(`Failed to fetch ${type} movies`);
  }
}

export async function getMovieCredits(movieId: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw new Error("Failed to fetch movie credits");
  }
}

export async function getSimilarMovies(movieId: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    throw new Error("Failed to fetch similar movies");
  }
}

export async function getMovieById(movieId: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw new Error("Failed to fetch movie details");
  }
}

export async function searchMovies(query: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw new Error("Failed to search movies");
  }
}

export async function getMovieVideos(movieId: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
    );
    let filteredVideos = response.data.results.filter(
      (video: any) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official === true &&
        video.name.toLowerCase().includes("official trailer")
    );

    if (filteredVideos.length === 0) {
      filteredVideos = response.data.results.filter(
        (video: any) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official === true
      );
    }

    return { id: response.data.id, results: filteredVideos };
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw new Error("Failed to fetch movie videos");
  }
} 