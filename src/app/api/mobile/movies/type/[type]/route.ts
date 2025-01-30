import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const type = params.type
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?api_key=${process.env.TMDB_API_KEY}&page=${page}`
    )
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching movies by type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
} 