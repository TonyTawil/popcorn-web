import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'

export async function PUT(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const { rating, comment } = await request.json()
    const reviewId = params.reviewId

    await connectDB()

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { 
        rating, 
        comment,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'username firstName lastName profilePicture')

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

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

export async function DELETE(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const reviewId = params.reviewId
    const { userId } = await request.json()

    await connectDB()

    const review = await Review.findById(reviewId)
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Verify the user owns this review
    if (review.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this review' },
        { status: 403 }
      )
    }

    await Review.findByIdAndDelete(reviewId)

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