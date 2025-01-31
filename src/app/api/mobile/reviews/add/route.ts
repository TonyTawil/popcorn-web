import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'
import { Error } from 'mongoose'

export async function POST(request: Request) {
  try {
    await connectDB()

    const { userId, movieId, rating, reviewText } = await request.json()

    // Validate required fields
    if (!userId || !movieId || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating value
    if (rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 5' },
        { status: 400 }
      )
    }

    // Check for existing review with both userId and movieId
    const existingReview = await Review.findOne({
      userId: userId,
      movieId: movieId
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this movie' },
        { status: 409 }
      )
    }

    // Create and save the new review
    const review = new Review({
      userId,
      movieId,
      rating,
      reviewText,
      createdAt: new Date()
    })

    const savedReview = await review.save()

    // Populate the user information
    const populatedReview = await Review.findById(savedReview._id)
      .populate('userId', '_id username')

    if (!populatedReview) {
      throw new Error('Failed to populate review')
    }

    return NextResponse.json(populatedReview)
  } catch (error: unknown) {
    console.error('Error adding review:', error)
    
    // Check if it's a MongoDB validation error
    if (error instanceof Error.ValidationError) {
      return NextResponse.json(
        { error: 'Invalid review data: ' + error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    )
  }
} 