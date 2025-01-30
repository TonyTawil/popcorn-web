import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const movieIds = searchParams.get('ids')
    
    if (!movieIds) {
      return NextResponse.json(
        { error: 'Movie IDs are required' },
        { status: 400 }
      )
    }

    // Fetch details for all movies in parallel
    const moviePromises = movieIds.split(',').map(async (id) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits&api_key=${process.env.TMDB_API_KEY}`
      )
      return response.json()
    })

    const moviesData = await Promise.all(moviePromises)
    
    return NextResponse.json(moviesData)
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    )
  }
} 