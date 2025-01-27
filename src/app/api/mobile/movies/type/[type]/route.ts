import { NextResponse } from 'next/server'

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
    
    // Add cache headers
    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching movies by type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
} 