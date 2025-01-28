import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchedMovie } from '@/types/watched'

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

    // Check if movie already exists in watched list
    const movieExists = user.watched.some((movie: WatchedMovie) => movie.movieId === movieId)
    if (movieExists) {
      return NextResponse.json(
        { error: 'Movie already in watched list' },
        { status: 409 }
      )
    }

    // Add movie to watched list and remove from watchlist if present
    user.watched.push({
      movieId,
      title,
      coverImage
    })

    // Remove from watchlist if present
    user.watchList = user.watchList.filter((movie: WatchedMovie) => movie.movieId !== movieId)

    await user.save()

    return NextResponse.json({
      message: 'Movie added to watched list successfully',
      watched: user.watched,
      watchList: user.watchList
    })
  } catch (error) {
    console.error('Error adding to watched list:', error)
    return NextResponse.json(
      { error: 'Failed to add movie to watched list' },
      { status: 500 }
    )
  }
} 