import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchlistMovie } from '@/types/movie'

export async function POST(req: Request) {
  try {
    const { userId, movieId, title, posterPath } = await req.json()

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
      posterPath,
      addedAt: new Date()
    })

    await user.save()

    return NextResponse.json({
      message: 'Movie added to watchlist successfully',
      movie: {
        movieId,
        title,
        posterPath
      }
    })
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    return NextResponse.json(
      { error: 'Failed to add movie to watchlist' },
      { status: 500 }
    )
  }
} 