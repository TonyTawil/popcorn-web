import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'

export async function PUT(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { userId, rating, reviewText } = await request.json()
    const reviewId = params.reviewId

    if (!userId || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    const review = await Review.findById(reviewId)
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    if (review.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this review' },
        { status: 403 }
      )
    }

    review.rating = rating
    review.reviewText = reviewText
    await review.save()

    return NextResponse.json({
      message: 'Review updated successfully',
      review
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
} 