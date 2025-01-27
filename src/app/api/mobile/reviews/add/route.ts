import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'

export async function POST(req: Request) {
  try {
    const { userId, movieId, rating, comment } = await req.json()

    await connectDB()

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({ userId, movieId })
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this movie' },
        { status: 409 }
      )
    }

    const review = await Review.create({
      userId,
      movieId,
      rating,
      comment,
      createdAt: new Date()
    })

    await review.populate('userId', 'username firstName lastName profilePicture')

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