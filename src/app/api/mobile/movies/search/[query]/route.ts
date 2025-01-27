import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 0

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  try {
    const query = params.query

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
      { next: { revalidate: 0 } }
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