import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      username: string
      isEmailVerified: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    firstName: string
    lastName: string
    username: string
    isEmailVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    firstName: string
    lastName: string
    username: string
    isEmailVerified: boolean
  }
} 