import prisma from "@/lib/prisma"; // Importing our singleton Prisma instance

/**
 * An async Server Component that fetches and displays the live stock quantity
 * for a given product. It's designed to be wrapped in a <Suspense> boundary
 * to allow its content to be streamed to the client.
 *
 * @param {string} productId - The ID of the product to fetch stock for.
 */
export default async function StockIndicator({ productId }: { productId: string }) {
  
  // This artificial delay is added to visually demonstrate the streaming effect of Suspense.
  // In a real application, you might remove this or adjust the timing.
  // It simulates a database query or API call that takes some time to resolve.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Fetch the product's stock quantity directly from the database.
  // This is a secure server-side operation.
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stockQuantity: true },
  });

  // Safely get the stock count, defaulting to 0 if the product is not found.
  const stock = product?.stockQuantity ?? 0;
  
  // To create a meaningful progress bar, we need a baseline for the initial stock.
  // In a real-world scenario, you would likely store this `initialStock` value
  // on the product model in your database to make it dynamic.
  const initialStock = 50; 
  const percentage = Math.max(0, (stock / initialStock)) * 100;

  return (
    <div className="my-4">
      {/* The progress bar container */}
      <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden shadow-inner">
        {/* The dynamic progress bar itself */}
        <div
          className="bg-gradient-to-r from-yellow-300 to-orange-400 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Textual indicator of the stock status */}
      <p className="mt-2 text-sm font-bold text-center text-gray-700">
        {stock > 0
          ? `${stock} ${stock === 1 ? 'item' : 'items'} left - Don't miss out!`
          : "Completely Sold Out!"}
      </p>
    </div>
  );
}