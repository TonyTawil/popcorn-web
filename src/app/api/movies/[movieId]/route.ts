import { NextResponse } from 'next/server';
import { getMovieById, getMovieCredits, getSimilarMovies, getMovieVideos } from '@/lib/tmdb';

export async function GET(
  req: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const movieId = params.movieId;

    const [movieDetails, credits, similar, videos] = await Promise.all([
      getMovieById(movieId),
      getMovieCredits(movieId),
      getSimilarMovies(movieId),
      getMovieVideos(movieId),
    ]);

    return NextResponse.json({
      movie: movieDetails,
      credits,
      similar,
      videos,
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
} 