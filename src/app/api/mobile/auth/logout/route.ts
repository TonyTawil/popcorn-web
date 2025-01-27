import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // For mobile, we just need to return a success response
    // as the client will handle clearing local storage/preferences
    return NextResponse.json({
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
} 