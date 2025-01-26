import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/db/mongodb';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    
    const user = await User.findById(params.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isVerified: user.isEmailVerified
    });
  } catch (error) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
} 