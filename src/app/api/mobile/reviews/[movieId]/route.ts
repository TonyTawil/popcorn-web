import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { ReviewType } from '@/types/review'

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const movieId = parseInt(params.movieId)
    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: 'Invalid movie ID' },
        { status: 400 }
      )
    }

    await connectDB()

    if (!User) {
      throw new Error('User model not registered')
    }

    const reviews = await Review.find({ movieId })
      .populate('userId', '_id username')
      .sort({ createdAt: -1 })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
} 