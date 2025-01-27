import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Resend } from 'resend'
import User from '@/models/User'
import connectDB from '@/db/mongodb'
import { generateEmailToken } from '@/lib/auth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, username, email, password, gender } = body

    await connectDB()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long and contain letters, numbers, and at least one special character (@$!%*?&)' },
        { status: 400 }
      )
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = generateEmailToken()

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      gender,
      profilePicture: gender === 'male'
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      watchList: []
    })

    // Send verification email using Resend
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@antoinetawil.com',
      to: email,
      subject: 'Welcome to Popcorn - Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Popcorn</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
              <tr>
                <td style="padding: 40px 30px; background-color: #ffffff; border-radius: 8px; margin-top: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333333; margin: 0; font-size: 24px; font-weight: bold;">Welcome to Popcorn! 🍿</h1>
                  </div>
                  
                  <div style="margin-bottom: 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                    <p>Thank you for joining Popcorn! We're excited to have you as part of our community.</p>
                    <p>To get started, please verify your email address by clicking the button below:</p>
                  </div>
                  
                  <div style="text-align: center; margin-bottom: 30px;">
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #FF4B4B; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 14px;">
                      Verify Email Address
                    </a>
                  </div>
                  
                  <div style="margin-bottom: 30px; color: #666666; font-size: 14px; line-height: 1.5;">
                    <p>This verification link will expire in 24 hours.</p>
                    <p>If you didn't create an account with Popcorn, you can safely ignore this email.</p>
                  </div>
                  
                  <div style="border-top: 1px solid #eeeeee; padding-top: 20px; color: #999999; font-size: 12px; text-align: center;">
                    <p>Need help? Contact us at support@popcorn.com</p>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    })

    return NextResponse.json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: `${user.firstName} ${user.lastName}`,
        verified: false
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 