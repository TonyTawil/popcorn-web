import NextAuth, { AuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import User from '@/models/User'
import connectDB from '@/db/mongodb'

interface CustomUser extends NextAuthUser {
  firstName: string;
  lastName: string;
  username: string;
  isEmailVerified: boolean;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          isEmailVerified: user.isEmailVerified,
          image: null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firstName = (user as CustomUser).firstName
        token.lastName = (user as CustomUser).lastName
        token.username = (user as CustomUser).username
        token.isEmailVerified = (user as CustomUser).isEmailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.username = token.username as string
        session.user.isEmailVerified = token.isEmailVerified as boolean
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 