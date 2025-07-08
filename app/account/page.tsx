import { auth } from "@/auth";
import prisma from "@/lib/prisma"; // Make sure to import your Prisma instance
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/**
 * An async Server Component to display the user's account page,
 * including their order history.
 */
export default async function AccountPage() {
  // 1. Get the user's session
  const session = await auth();
  if (!session?.user?.id) {
    // This should be caught by middleware, but it's a good safeguard
    redirect("/api/auth/signin?callbackUrl=/account");
  }

  // 2. Fetch the user's orders from the database using their ID
  // We use `include: { product: true }` to also get the details of the product in each order.
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: true, // This is crucial to get product name and image
    },
    orderBy: {
      createdAt: 'desc', // Show the most recent orders first
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Account</h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {session.user.name}! Here is your order history.
          </p>
        </header>

        <div className="rounded-lg border bg-white shadow-sm">
          <h2 className="p-6 text-xl font-semibold border-b">Your Orders</h2>
          
          {/* 3. Conditionally render the list of orders or the "no orders" message */}
          {orders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="p-6 flex items-start space-x-6">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={order.product.imageUrl}
                      alt={order.product.name}
                      fill
                      className="object-contain rounded-md"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {order.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Order Placed: {order.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order ID: {order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            // This part will now only show if the database query returns an empty array
            <div className="p-12 text-center">
              <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
              <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                &larr; Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}