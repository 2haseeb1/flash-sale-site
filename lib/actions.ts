"use server"; // This directive is essential. It marks all exported functions in this file as Server Actions.

import { auth } from "@/auth"; // To get the authenticated user's session
import prisma from "@/lib/prisma"; // Our singleton Prisma Client instance
import { revalidatePath } from "next/cache"; // To invalidate the cache and show fresh data

// Define the shape of the object that our action will return to the client.
interface PurchaseResult {
  success: boolean;
  message: string;
  orderId?: string; // Optionally return the new order ID on success
}

/**
 * A Server Action to purchase a flash sale item.
 * This function is designed to be atomic and secure.
 * @param {string} productId - The ID of the product the user is trying to purchase.
 * @returns {Promise<PurchaseResult>} - An object indicating the outcome of the action.
 */
export async function purchaseFlashSaleItem(
  productId: string
): Promise<PurchaseResult> {
  // 1. Authenticate the user
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "Authentication required. Please sign in to purchase.",
    };
  }

  const userId = session.user.id;

  try {
    // 2. Use a database transaction to ensure data integrity (atomicity).
    // This entire block of code will either succeed completely or fail completely,
    // leaving the database in a consistent state. It prevents race conditions.
    const order = await prisma.$transaction(async (tx) => {
      // Inside the transaction, `tx` is used instead of `prisma`.

      // Step A: Find the product and lock the row for the duration of the transaction.
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      // Step B: Perform validation checks.
      if (!product) {
        throw new Error("Product not found.");
      }
      if (product.stockQuantity <= 0) {
        throw new Error("Sorry, this item is already sold out!");
      }
      const now = new Date();
      if (now < product.saleStartsAt) {
        throw new Error("This sale has not started yet.");
      }
      if (now > product.saleEndsAt) {
        throw new Error("Unfortunately, this sale has ended.");
      }

      // Step C: Decrement the stock quantity by 1.
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stockQuantity: { decrement: 1 } },
      });

      // Optional: Another check to ensure we didn't go below zero.
      if (updatedProduct.stockQuantity < 0) {
        throw new Error("A stock conflict occurred. Please try again.");
      }

      // Step D: Create the order record for the user.
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          productId: productId,
          quantity: 1,
          totalPrice: product.salePrice,
        },
      });

      return newOrder;
    });

    // 3. Revalidate the cache for the deal page.
    // This tells Next.js to serve fresh data (with the new stock count) to all users
    // who visit this page next.
    revalidatePath(`/deals/${productId}`);
    revalidatePath("/"); // Also revalidate the homepage if it lists deals

    // 4. Return a success response.
    return {
      success: true,
      message: "Purchase successful!",
      orderId: order.id,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // 5. Catch any errors thrown from the transaction and return a failure response.
    return {
      success: false,
      message: error.message || "An unexpected server error occurred.",
    };
  }
}
