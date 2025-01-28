import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchedMovie } from '@/types/watched'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    return NextResponse.json({
      watched: user.watched.map((movie: WatchedMovie) => ({
        movieId: movie.movieId,
        title: movie.title,
        coverImage: movie.coverImage
      }))
    })
  } catch (error) {
    console.error('Error fetching watched list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watched list' },
      { status: 500 }
    )
  }
} 