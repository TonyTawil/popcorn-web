import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import User from '@/models/User';
import connectDB from '@/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ watchList: user.watchList });
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
          (movie) => movie.movieId === movieId
        );

        if (isMovieInWatchlist) {
          return NextResponse.json(
            { error: 'Movie already in watchlist' },
            { status: 409 }
          );
        }

        user.watchList.push({ movieId, title, coverImage });
        await user.save();

        return NextResponse.json({
          message: 'Movie added to watchlist',
          watchList: user.watchList,
        });
      }

      case 'remove': {
        user.watchList = user.watchList.filter(
          (movie) => movie.movieId !== movieId
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