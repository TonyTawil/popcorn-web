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
      .populate('userId', '_id username')
      .sort({ createdAt: -1 });

    const transformedReviews = reviews.map(review => {
      const plainReview = review.toObject();
      if (plainReview.userId && plainReview.userId._id) {
        plainReview.userId = plainReview.userId._id;
      }
      return plainReview;
    });

    return NextResponse.json(transformedReviews);
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
      .populate('userId', '_id username');

    // Transform the review to ensure userId is just the ID
    const plainReview = populatedReview.toObject();
    if (plainReview.userId && plainReview.userId._id) {
      plainReview.userId = plainReview.userId._id;
    }

    return NextResponse.json(plainReview);
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { reviewId, rating, reviewText } = await req.json();

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this review' },
        { status: 403 }
      );
    }

    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', '_id username');

    // Transform the review to ensure userId is just the ID
    const plainReview = populatedReview.toObject();
    if (plainReview.userId && plainReview.userId._id) {
      plainReview.userId = plainReview.userId._id;
    }

    return NextResponse.json(plainReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this review' },
        { status: 403 }
      );
    }

    await review.deleteOne();

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 