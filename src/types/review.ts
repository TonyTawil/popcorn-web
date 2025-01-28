export interface ReviewType {
  _id?: string;
  movieId: number;
  userId: string;
  rating: number;
  reviewText?: string;
  replies?: ReplyType[];
  likes?: string[];
  likesCount?: number;
  createdAt?: Date;
}

export interface ReplyType {
  _id?: string;
  userId: string;
  replyText: string;
  likes?: string[];
  likesCount?: number;
  createdAt?: Date;
} 