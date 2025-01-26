import { NextResponse } from 'next/server';
import { getTrending, getMoviesByType } from '@/lib/tmdb';

export async function GET(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
    const type = params.type;
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;

    let data;
    if (type === 'trending') {
      data = await getTrending(page);
    } else {
      data = await getMoviesByType(type, page);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 