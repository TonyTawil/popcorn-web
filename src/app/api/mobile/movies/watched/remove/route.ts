import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchedMovie } from '@/types/movie'

export async function POST(req: Request) {
  try {
    const { userId, movieId } = await req.json()

    await connectDB()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove movie from watched list
    if (user.watchedList) {
      user.watchedList = user.watchedList.filter((movie: WatchedMovie) => movie.movieId !== movieId)
      await user.save()
    }

    return NextResponse.json({
      message: 'Movie removed from watched list successfully'
    })
  } catch (error) {
    console.error('Error removing from watched list:', error)
    return NextResponse.json(
      { error: 'Failed to remove movie from watched list' },
      { status: 500 }
    )
  }
} 