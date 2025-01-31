import { NextResponse } from 'next/server'
import Review from '@/models/Review'
import connectDB from '@/db/mongodb'
import { Error, model, models, Types } from 'mongoose'
import mongoose from 'mongoose'

// Define User model here since it might not be registered yet
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  email: String,
  password: String,
  // other fields...
}, { collection: 'users' }) // Specify the collection name explicitly

// Get or create the User model
const User = models.User || model('User', userSchema)

export async function POST(request: Request) {
  try {
    await connectDB()

    const { userId, movieId, rating, reviewText } = await request.json()
    console.log('Received userId:', userId)

    // Validate required fields
    if (!userId || !movieId || rating === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      // Convert string ID to ObjectId
      const userObjectId = new Types.ObjectId(userId)
      console.log('Looking for user with ObjectId:', userObjectId)

      const user = await User.findById(userObjectId)
      console.log('Found user:', user)

      if (!user) {
        console.error('User not found with ID:', userId)
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Check for existing review
      const existingReview = await Review.findOne({
        userId: userObjectId,
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
        userId: userObjectId,
        movieId,
        rating,
        reviewText,
        createdAt: new Date(),
        likes: [],
        likesCount: 0,
        replies: []
      })

      const savedReview = await review.save()

      // Return the review with user data
      const populatedReview = {
        ...savedReview.toObject(),
        userId: {
          _id: user._id,
          username: user.username
        }
      }

      return NextResponse.json(populatedReview)

    } catch (error: unknown) {
      console.error('Error processing user:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return NextResponse.json(
        { error: 'Error processing user data: ' + errorMessage },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('Error adding review:', error)
    
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