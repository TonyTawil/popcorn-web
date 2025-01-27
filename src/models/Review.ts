import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)

export default Review 