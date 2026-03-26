import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// 扩展 Session 类型以包含 user.id 和 role
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
        // 从数据库中获取最新的用户信息，确保角色是最新的
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub }
          })
          if (user) {
            session.user.role = user.role
          }
        } catch (error) {
          console.error('获取用户信息失败:', error)
        }
      } else if (token.role) {
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }