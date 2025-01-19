import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
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
        return NextResponse.json({
          message: 'Email already verified',
          user: {
            id: verifiedUser._id,
            email: verifiedUser.email,
            name: `${verifiedUser.firstName} ${verifiedUser.lastName}`,
            verified: true
          }
        });
      }

      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isEmailVerified = true;
    await user.save();

    return NextResponse.json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        verified: true
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during email verification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 