import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email
    
    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'User found',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: `${user.firstName} ${user.lastName}`,
        verified: user.isEmailVerified  // Make sure this is included
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
} 