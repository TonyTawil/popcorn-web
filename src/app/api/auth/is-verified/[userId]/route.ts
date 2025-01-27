import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    await connectDB();
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Verification status for user:', {
      userId,
      isEmailVerified: user.isEmailVerified
    });

    return NextResponse.json({
      isEmailVerified: user.isEmailVerified,
      message: user.isEmailVerified 
        ? 'Email is verified' 
        : 'Email is not verified'
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
} 