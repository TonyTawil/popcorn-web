import { NextResponse } from 'next/server';
import { getTrending, getMoviesByType } from '@/lib/tmdb';
import { getTrendingTv, getTvByType } from '@/lib/tmdbTv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const page = searchParams.get('page') || '1';
  const mode = searchParams.get('mode') || 'movies';

  try {
    let data;

    if (mode === 'movies') {
      if (type === 'trending') {
        data = await getTrending(parseInt(page));
      } else {
        data = await getMoviesByType(type || 'now_playing', parseInt(page));
      }
    } else {
      if (type === 'trending') {
        data = await getTrendingTv(parseInt(page));
      } else {
        data = await getTvByType(type || 'airing_today', parseInt(page));
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 