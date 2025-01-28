import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchedMovie } from '@/types/watched'

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

    // Remove movie from watched list
    user.watched = user.watched.filter((movie: WatchedMovie) => movie.movieId !== movieId)
    await user.save()

    return NextResponse.json({
      message: 'Movie removed from watched list successfully',
      watched: user.watched
    })
  } catch (error) {
    console.error('Error removing from watched list:', error)
    return NextResponse.json(
      { error: 'Failed to remove movie from watched list' },
      { status: 500 }
    )
  }
} 