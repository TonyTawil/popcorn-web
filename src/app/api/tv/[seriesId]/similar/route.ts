import { NextResponse } from "next/server";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: Request,
  { params }: { params: { seriesId: string } }
) {
  try {
    const response = await axios.get(
      `${BASE_URL}/tv/${params.seriesId}/similar?api_key=${TMDB_API_KEY}`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching similar TV series:", error);
    return NextResponse.json(
      { error: "Failed to fetch similar TV series" },
      { status: 500 }
    );
  }
} 