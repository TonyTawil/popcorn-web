import mongoose, { Document } from 'mongoose';

interface IMovieList {
  movieId: number;
  title: string;
  coverImage: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: Date;
  isGoogleAccount: boolean;
  watchList: IMovieList[];
  watched: IMovieList[];
  createdAt: Date;
  updatedAt: Date;
}

const movieListSchema = new mongoose.Schema<IMovieList>(
  {
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    profilePicture: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { 
      type: String,
      index: true,
      sparse: true
    },
    emailVerificationTokenExpiry: { 
      type: Date,
      sparse: true
    },
    isGoogleAccount: { type: Boolean, default: false },
    watchList: [movieListSchema],
    watched: [movieListSchema],
  },
  { timestamps: true }
);

userSchema.index({ 
  emailVerificationToken: 1, 
  emailVerificationTokenExpiry: 1 
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User; 