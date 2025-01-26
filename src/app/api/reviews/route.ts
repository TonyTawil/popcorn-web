import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import Review from '@/models/Review';
import connectDB from '@/db/mongodb';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const reviews = await Review.find({ movieId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { movieId, rating, reviewText } = await req.json();

    await connectDB();

    const existingReview = await Review.findOne({
      movieId,
      userId: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this movie' },
        { status: 409 }
      );
    }

    const review = new Review({
      movieId,
      userId: session.user.id,
      rating,
      reviewText,
      createdAt: new Date()
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'username profilePicture');

    return NextResponse.json({
      review: populatedReview,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Implement update review logic
    return NextResponse.json({ message: 'Review updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('reviewId');
    
    // Implement delete review logic
    return NextResponse.json({ message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 