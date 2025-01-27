import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { WatchedMovie } from '@/types/movie'

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

    // Check if movie already exists in watched list
    const movieExists = user.watchedList?.some((movie: WatchedMovie) => movie.movieId === movieId)
    if (movieExists) {
      return NextResponse.json(
        { error: 'Movie already marked as watched' },
        { status: 409 }
      )
    }

    // Initialize watchedList if it doesn't exist
    if (!user.watchedList) {
      user.watchedList = []
    }

    // Add movie to watched list
    const newMovie: WatchedMovie = {
      movieId,
      title,
      posterPath,
      addedAt: new Date()
    }
    user.watchedList.push(newMovie)

    await user.save()

    return NextResponse.json({
      message: 'Movie marked as watched successfully',
      movie: newMovie
    })
  } catch (error) {
    console.error('Error adding to watched list:', error)
    return NextResponse.json(
      { error: 'Failed to mark movie as watched' },
      { status: 500 }
    )
  }
} 