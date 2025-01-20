export interface WatchlistMovie {
  movieId: string;
  title: string;
  coverImage: string;
}

export interface UserDocument {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: Date;
  watchList: WatchlistMovie[];
} 