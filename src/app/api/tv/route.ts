import { NextResponse } from 'next/server';
import { getTrendingTv, getTvByType } from '@/lib/tmdbTv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const page = searchParams.get('page') || '1';

  try {
    let data;

    if (type === 'trending') {
      data = await getTrendingTv(parseInt(page));
    } else {
      data = await getTvByType(type || 'airing_today', parseInt(page));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching TV data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 