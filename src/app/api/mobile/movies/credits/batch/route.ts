import { NextResponse } from 'next/server';
import { getMovieCredits } from '@/lib/tmdb';
import { CreditsResponse } from '@/types/tmdb';

interface BatchCreditsResponse {
  [movieId: number]: CreditsResponse;
}

export async function POST(request: Request) {
  try {
    const movieIds: number[] = await request.json();
    
    // Fetch all credits in parallel
    const creditsPromises = movieIds.map(id => getMovieCredits(id.toString()));
    const creditsResults = await Promise.all(creditsPromises);
    
    // Create a map of movieId -> credits
    const response: BatchCreditsResponse = movieIds.reduce((acc, id, index) => {
      acc[id] = creditsResults[index];
      return acc;
    }, {} as BatchCreditsResponse);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching batch credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
} 