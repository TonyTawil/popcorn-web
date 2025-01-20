import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import connectDB from '@/db/mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isVerification: { label: "Is Verification", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email) {
            throw new Error('Email is required')
          }

          await connectDB()
          
          const user = await User.findOne({ email: credentials.email })
          
          if (!user) {
            throw new Error('No user found')
          }

          // Handle email verification login
          if (credentials.isVerification === 'true') {
            if (user.isEmailVerified) {
              return {
                id: user._id.toString(),
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                image: user.profilePicture,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                isEmailVerified: user.isEmailVerified
              }
            }
            throw new Error('Email not verified')
          }

          // Regular password login
          if (!user.isEmailVerified) {
            throw new Error('Please verify your email first')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.profilePicture,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            isEmailVerified: user.isEmailVerified
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.username = user.username
        token.isEmailVerified = user.isEmailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email as string
        session.user.name = token.name
        session.user.image = token.picture
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.username = token.username as string
        session.user.isEmailVerified = token.isEmailVerified as boolean
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  debug: true, // Enable debug mode to see more detailed logs
  secret: process.env.NEXTAUTH_SECRET,
} 