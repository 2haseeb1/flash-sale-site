// This file is the catch-all route for NextAuth.js.
// It automatically handles requests to URLs like:
// /api/auth/signin
// /api/auth/signout
// /api/auth/callback/github
// /api/auth/session
// ...and more.

// We import the `handlers` object from our central auth configuration file.
import { handlers } from "@/auth";

// The `handlers` object contains two methods: GET and POST.
// We are re-exporting these handlers here.
// When a GET request comes to this route, the GET handler from NextAuth.js will be used.
// When a POST request comes, the POST handler will be used.
export const { GET, POST } = handlers;

// Optional: You can also add this line for compatibility with edge runtimes,
// although it's not strictly necessary for most server-based deployments.
// export const runtime = "edge";
