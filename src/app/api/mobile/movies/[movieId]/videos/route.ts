import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const movieId = params.movieId
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}`
    )
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching movie trailers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie trailers' },
      { status: 500 }
    )
  }
} 