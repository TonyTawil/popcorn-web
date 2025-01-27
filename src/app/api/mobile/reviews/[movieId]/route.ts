import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'
import { ReviewType } from '@/types/review'

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const movieId = parseInt(params.movieId)

    await connectDB()

    const reviews = await Review.find({ movieId })
      .populate('userId', 'username firstName lastName')
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