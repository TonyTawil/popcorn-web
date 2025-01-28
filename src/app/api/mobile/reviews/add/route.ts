import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'
import { ReviewType } from '@/types/review'

export async function POST(req: Request) {
  try {
    const { userId, movieId, rating, reviewText } = await req.json()

    if (!userId || !movieId || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({ userId, movieId })
    if (existingReview) {
      return NextResponse.json(
        { error: 'User has already reviewed this movie' },
        { status: 409 }
      )
    }

    const review = new Review({
      movieId,
      userId,
      rating,
      reviewText,
      replies: [],
      likes: [],
      likesCount: 0
    })

    await review.save()

    return NextResponse.json({
      message: 'Review added successfully',
      review
    })
  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    )
  }
} 