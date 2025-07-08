import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flash Deals Today",
  description: "Daily limited-time deals on the best products.",
};

// An async Server Component to dynamically show a Sign In or Sign Out button.
async function AuthButton() {
  const session = await auth();

  return session?.user ? (
    <div className="flex items-center gap-4">
      <Link href="/account" className="text-sm font-semibold hover:underline">
        My Orders
      </Link>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit" className="text-sm font-semibold hover:underline">
          Sign Out
        </button>
      </form>
    </div>
  ) : (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button type="submit" className="text-sm font-semibold hover:underline">
        Sign In
      </button>
    </form>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
          <nav className="container mx-auto flex items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold text-gray-900">
              ⚡ FlashDeals
            </Link>
            {/* The AuthButton is rendered on the server */}
            <AuthButton />
          </nav>
        </header>

        <main className="bg-gray-50">
          {children}
        </main>

        <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FlashDeals Inc. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}