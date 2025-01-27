import mongoose, { Document } from 'mongoose';

export interface IReply extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  replyText: string;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  createdAt: Date;
}

export interface IReview extends Document {
  _id: string;
  movieId: number;
  userId: mongoose.Types.ObjectId;
  rating: number;
  reviewText?: string;
  replies: IReply[];
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  createdAt: Date;
}

const replySchema = new mongoose.Schema<IReply>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replyText: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema<IReview>({
  movieId: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviewText: { type: String, required: false },
  replies: [replySchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
export default Review; 