import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // This is important for search functionality

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    )
    const data = await tmdbResponse.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching movies:', error)
    return NextResponse.json(
      { error: 'Failed to search movies' },
      { status: 500 }
    )
  }
} 