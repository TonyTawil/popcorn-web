import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Resend } from 'resend';
import User from '@/models/User';
import connectDB from '@/db/mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      emailVerificationToken,
      emailVerificationTokenExpiry,
      isEmailVerified: false,
      watchList: []
    });

    // Generate verification URL using SITE_URL environment variable
    const verificationUrl = `${process.env.SITE_URL}/verify-email?token=${emailVerificationToken}`;

    // Send verification email
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@antoinetawil.com',
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to Popcorn!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });

    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: newUser._id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        verified: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Use this verificationUrl in your email template 