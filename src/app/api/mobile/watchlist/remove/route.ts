import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchlistMovie } from '@/types/watchlist'

export async function POST(req: Request) {
  try {
    const { userId, movieId } = await req.json()

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: 'User ID and Movie ID are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove movie from watchlist
    user.watchList = user.watchList.filter((movie: WatchlistMovie) => movie.movieId !== movieId)
    await user.save()

    return NextResponse.json({
      message: 'Movie removed from watchlist successfully',
      watchList: user.watchList
    })
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove movie from watchlist' },
      { status: 500 }
    )
  }
} 