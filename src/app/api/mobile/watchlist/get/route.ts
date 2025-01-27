import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchlistMovie } from '@/types/watchlist'

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
      watchList: user.watchList.map((movie: WatchlistMovie) => ({
        movieId: movie.movieId,
        title: movie.title,
        coverImage: movie.coverImage
      }))
    })
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
} 