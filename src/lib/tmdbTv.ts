import axios from "axios";
import type { TMDBResponse } from "@/types/tmdb";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getTrendingTv(page = 1): Promise<TMDBResponse> {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching trending TV shows:", error);
    throw new Error("Failed to fetch trending TV shows");
  }
}

export async function getTvByType(type: string, page = 1): Promise<TMDBResponse> {
  try {
    // Map the type to the correct endpoint
    const endpoint = type === "airing_today" 
      ? "airing_today"
      : type === "top_rated"
      ? "top_rated"
      : "popular";

    const response = await axios.get(
      `${BASE_URL}/tv/${endpoint}?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} TV shows:`, error);
    throw new Error(`Failed to fetch ${type} TV shows`);
  }
} 