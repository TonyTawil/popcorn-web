import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function generateEmailToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateJwtToken(userId: string, isEmailVerified: boolean): string {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    { userId, isEmailVerified },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: '7d' }
  );
} 