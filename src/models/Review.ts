import mongoose, { Document } from 'mongoose';
import { IUser } from './User';

interface IReply extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  replyText: string;
  likes: (mongoose.Types.ObjectId | IUser)[];
  likesCount: number;
  createdAt: Date;
}

export interface IReview extends Document {
  movieId: number;
  userId: mongoose.Types.ObjectId | IUser;
  rating: number;
  reviewText?: string;
  replies: IReply[];
  likes: (mongoose.Types.ObjectId | IUser)[];
  likesCount: number;
  createdAt: Date;
}

const replySchema = new mongoose.Schema<IReply>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  replyText: { type: String, required: true },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema<IReview>({
  movieId: { 
    type: Number, 
    required: true,
    index: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 5,
    index: true
  },
  reviewText: { type: String, required: false },
  replies: [replySchema],
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true },
});

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
export default Review; 