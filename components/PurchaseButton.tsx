"use client";

import { useTransition } from "react";
import { purchaseFlashSaleItem } from "@/lib/actions"; // Importing the Server Action

/**
 * A Client Component that renders a button to purchase a flash sale item.
 * It handles the user click, calls a Server Action, and manages the UI's pending state.
 *
 * @param {string} productId - The ID of the product to be purchased.
 * @param {boolean} isSoldOut - A prop passed from the server to know if the item is already sold out.
 * @param {boolean} isSaleActive - A prop to know if the sale is currently active.
 */
export function PurchaseButton({
  productId,
  isSoldOut,
  isSaleActive,
}: {
  productId: string;
  isSoldOut: boolean;
  isSaleActive: boolean;
}) {
  // The `useTransition` hook is essential for Server Actions.
  // It allows us to track the pending state of an action without blocking the UI.
  // `isPending` will be `true` while the `purchaseFlashSaleItem` action is running on the server.
  const [isPending, startTransition] = useTransition();

  const handlePurchase = () => {
    // We wrap the async Server Action call inside `startTransition`.
    // This tells React to start the state transition and update the `isPending` flag.
    startTransition(async () => {
      // Call the Server Action with the product ID.
      const result = await purchaseFlashSaleItem(productId);

      // Handle the result returned from the Server Action.
      if (result.success) {
        // Provide feedback to the user on success.
        alert(`Purchase successful! Your order ID is ${result.orderId}. Thank you!`);
        // In a more advanced application, you might use a toast notification library
        // or redirect the user to an order confirmation page.
        // For example: window.location.href = `/orders/${result.orderId}`;
      } else {
        // Provide feedback on failure.
        alert(`Purchase failed: ${result.message}`);
      }
    });
  };

  // Determine the button's disabled state and text based on the current conditions.
  const isDisabled = isPending || isSoldOut || !isSaleActive;
  let buttonText = "Buy Now!";
  if (isSoldOut) buttonText = "Sold Out!";
  if (!isSaleActive) buttonText = "Sale Not Active";
  if (isPending) buttonText = "Processing...";

  return (
    <button
      onClick={handlePurchase}
      disabled={isDisabled}
      className="w-full mt-4 rounded-lg bg-blue-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
    >
      {buttonText}
    </button>
  );
}