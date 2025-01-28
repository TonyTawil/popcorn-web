import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'

export async function DELETE(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { userId } = await request.json()
    const reviewId = params.reviewId

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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
        { error: 'Unauthorized to delete this review' },
        { status: 403 }
      )
    }

    await review.deleteOne()

    return NextResponse.json({
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
} 