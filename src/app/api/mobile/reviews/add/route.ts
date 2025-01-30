import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { ReviewType } from '@/types/review'

export async function POST(request: Request) {
  try {
    const { userId, movieId, rating, reviewText } = await request.json()

    if (!userId || !movieId || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check for existing review
    const existingReview = await Review.findOne({ userId, movieId })
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this movie' },
        { status: 409 }
      )
    }

    const review = new Review({
      userId,
      movieId,
      rating,
      reviewText,
      createdAt: new Date()
    })

    await review.save()

    // Populate the user information before sending response
    const populatedReview = await Review.findById(review._id)
      .populate('userId', '_id username')

    return NextResponse.json(populatedReview)
  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    )
  }
} 