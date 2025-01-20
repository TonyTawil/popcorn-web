import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/verify-email?error=no-token', req.url));
    }

    await connectDB();

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      // Check if token was already used
      const verifiedUser = await User.findOne({
        emailVerificationToken: token
      });

      if (verifiedUser && verifiedUser.isEmailVerified) {
        return NextResponse.redirect(new URL('/login?message=already-verified', req.url));
      }

      return NextResponse.redirect(new URL('/verify-email?error=invalid-token', req.url));
    }

    // Update user verification status
    user.isEmailVerified = true;
    // Clear the verification token after successful verification
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.redirect(new URL('/login?message=verification-success', req.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/verify-email?error=server-error', req.url));
  }
} 