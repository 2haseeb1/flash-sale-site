import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Initialize a single instance of PrismaClient
const prisma = new PrismaClient();

// Here we configure NextAuth.js (v5)
// This file exports the core functions and handlers for authentication.
export const { handlers, auth, signIn, signOut } = NextAuth({
  // The adapter connects NextAuth.js to our database via Prisma.
  // It automatically handles creating users, linking accounts, managing sessions, etc.
  adapter: PrismaAdapter(prisma),

  // 'providers' is an array of the authentication methods you want to offer.
  // We are starting with GitHub. You could add Google, Email, etc., here.
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  // Callbacks allow you to customize the default behavior of NextAuth.js.
  callbacks: {
    // The `session` callback is called whenever a session is checked.
    // We are using it to add the user's `id` to the session object.
    // This makes it easy to access the user ID in our Server Components without an extra database query.
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id; // Add the user's database ID to the session object
      }
      return session;
    },
  },

  // (Optional) You can define custom pages for sign-in, sign-out, errors, etc.
  // pages: {
  //   signIn: '/login',
  // }
});
