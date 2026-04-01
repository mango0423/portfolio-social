import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
};

export const { auth: authEdge } = NextAuth(authOptions);
