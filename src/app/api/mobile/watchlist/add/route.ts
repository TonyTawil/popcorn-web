import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchlistMovie } from '@/types/watchlist'

export async function POST(req: Request) {
  try {
    const { userId, movieId, title, coverImage } = await req.json()

    if (!userId || !movieId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if movie already exists in watchlist
    const movieExists = user.watchList.some((movie: WatchlistMovie) => movie.movieId === movieId)
    if (movieExists) {
      return NextResponse.json(
        { error: 'Movie already in watchlist' },
        { status: 409 }
      )
    }

    // Add movie to watchlist
    user.watchList.push({
      movieId,
      title,
      coverImage
    })

    await user.save()

    return NextResponse.json({
      message: 'Movie added to watchlist successfully',
      watchList: user.watchList
    })
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to add movie to watchlist' },
      { status: 500 }
    )
  }
} 