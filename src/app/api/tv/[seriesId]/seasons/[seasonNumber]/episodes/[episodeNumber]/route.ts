import { NextResponse } from "next/server";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: Request,
  { params }: { params: { seriesId: string; seasonNumber: string; episodeNumber: string } }
) {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${params.seriesId}/season/${params.seasonNumber}/episode/${params.episodeNumber}?api_key=${TMDB_API_KEY}&append_to_response=credits`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching TV episode details:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV episode details" },
      { status: 500 }
    );
  }
} 