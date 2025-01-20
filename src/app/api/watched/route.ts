import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import User from '@/models/User';
import connectDB from '@/db/mongodb';
import type { IMovieList } from '@/models/User';

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

    return NextResponse.json({ watched: user.watched });
  } catch (error) {
    console.error('Get watched list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watched list' },
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
        const isMovieInWatched = user.watched.some(
          (movie: IMovieList) => movie.movieId === movieId
        );

        if (isMovieInWatched) {
          return NextResponse.json(
            { error: 'Movie already in watched list' },
            { status: 409 }
          );
        }

        // Add to watched and remove from watchlist if present
        user.watched.push({ movieId, title, coverImage });
        user.watchList = user.watchList.filter(
          (movie: IMovieList) => movie.movieId !== movieId
        );
        await user.save();

        return NextResponse.json({
          message: 'Movie added to watched list',
          watched: user.watched,
          watchList: user.watchList,
        });
      }

      case 'remove': {
        user.watched = user.watched.filter(
          (movie: IMovieList) => movie.movieId !== movieId
        );
        await user.save();

        return NextResponse.json({
          message: 'Movie removed from watched list',
          watched: user.watched,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Watched list operation error:', error);
    return NextResponse.json(
      { error: 'Failed to update watched list' },
      { status: 500 }
    );
  }
} 