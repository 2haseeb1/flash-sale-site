import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

/**
 * Fetches all products whose sale period is currently active.
 * This runs on the server for every request to ensure the list is always up-to-date.
 */
async function getActiveDeals() {
  const now = new Date();
  const activeDeals = await prisma.product.findMany({
    where: {
      saleStartsAt: {
        lte: now, // Sale must have started (less than or equal to now)
      },
      saleEndsAt: {
        gte: now, // Sale must not have ended (greater than or equal to now)
      },
      stockQuantity: {
        gt: 0, // Only show deals that are in stock
      },
    },
    orderBy: {
      saleEndsAt: 'asc', // Show deals ending soonest first
    },
  });
  return activeDeals;
}

// The Homepage is an async Server Component
export default async function HomePage() {
  const deals = await getActiveDeals();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Today&apos;s Hottest Deals
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
         {` Unbeatable prices on amazing products. These deals won't last forever, so act fast`}
        </p>
      </section>

      {/* Deals Grid Section */}
      <section>
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="group block overflow-hidden rounded-lg border shadow-md transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
              >
                <div className="relative h-60 w-full">
                  <Image
                    src={deal.imageUrl}
                    alt={deal.name}
                    fill // The `fill` prop makes the image fill its container
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="bg-white p-4">
                  <h3 className="truncate text-lg font-bold text-gray-800">{deal.name}</h3>
                  <div className="mt-2 flex items-baseline justify-end gap-2">
                    <span className="text-2xl font-bold text-red-600">${deal.salePrice.toFixed(2)}</span>
                    <span className="text-md text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed bg-white py-24 text-center">
            <h2 className="text-xl font-semibold text-gray-700">No Active Deals Right Now</h2>
            <p className="mt-2 text-gray-500">Please check back later for more amazing offers!</p>
          </div>
        )}
      </section>
    </div>
  );
}