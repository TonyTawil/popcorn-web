import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/db/mongodb'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    await connectDB()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Watched list fetched successfully',
      watched: user.watchedList || []
    })
  } catch (error) {
    console.error('Error fetching watched list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch watched list' },
      { status: 500 }
    )
  }
} 