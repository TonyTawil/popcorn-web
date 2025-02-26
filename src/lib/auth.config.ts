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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password')
        }

        try {
          await connectDB()
          
          const user = await User.findOne({ email: credentials.email })
          
          if (!user) {
            throw new Error('Invalid email or password')
          }

          if (!user.isEmailVerified) {
            throw new Error('Please verify your email first')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            throw new Error('Invalid email or password')
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
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
} 