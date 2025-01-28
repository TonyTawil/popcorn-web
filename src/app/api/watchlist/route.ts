import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import User from '@/models/User';
import connectDB from '@/db/mongodb';
import type { WatchlistMovie } from '@/types/user';

export const dynamic = 'force-dynamic';

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const dbUser = await User.findById(user.id).select('watchList');
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ watchList: dbUser.watchList || [] });
  } catch (error) {
    console.error('Get watchlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { type, movieId, title, coverImage } = await req.json();

    await connectDB();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    switch (type) {
      case 'add': {
        const isMovieInWatchlist = user.watchList.some(
          (movie: WatchlistMovie) => movie.movieId === movieId
        );

        if (isMovieInWatchlist) {
          return NextResponse.json(
            { error: 'Movie already in watchlist' },
            { status: 409 }
          );
        }

        const newMovie: WatchlistMovie = { movieId, title, coverImage };
        user.watchList.push(newMovie);
        await user.save();

        return NextResponse.json({
          message: 'Movie added to watchlist',
          watchList: user.watchList,
        });
      }

      case 'remove': {
        user.watchList = user.watchList.filter(
          (movie: WatchlistMovie) => movie.movieId !== movieId
        );
        await user.save();

        return NextResponse.json({
          message: 'Movie removed from watchlist',
          watchList: user.watchList,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Watchlist operation error:', error);
    return NextResponse.json(
      { error: 'Failed to update watchlist' },
      { status: 500 }
    );
  }
} 