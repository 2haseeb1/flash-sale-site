"use client";

import { useOptimistic, useTransition, useState } from "react"; // useState is also useful here
import { purchaseFlashSaleItem } from "@/lib/actions";

// StockIndicatorUI helper component (no changes needed here)
function StockIndicatorUI({ stock, initialStock }: { stock: number, initialStock: number }) {
  const percentage = Math.max(0, (stock / (initialStock || 1))) * 100; // Avoid division by zero
  return (
    <div className="my-4">
      <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-yellow-300 to-orange-400 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm font-bold text-center text-gray-700">
        {stock > 0
          ? `${stock} ${stock === 1 ? 'item' : 'items'} left - Don't miss out!`
          : "Completely Sold Out!"}
      </p>
    </div>
  );
}

// Main component with the fix
export default function PurchaseSection({
  productId,
  initialStock,
  isSaleActive,
}: {
  productId: string;
  initialStock: number;
  isSaleActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [hasSubmitted, setHasSubmitted] = useState(false); // To track if the purchase was attempted

  const [optimisticStock, setOptimisticStock] = useOptimistic(
    initialStock,
    (currentStock, amountToDecrement: number) => {
      return currentStock - amountToDecrement;
    }
  );

  const handlePurchase = () => {
    // Start the transition, and wrap ALL related state updates inside it.
    startTransition(async () => {
      // FIX: Move the optimistic update INSIDE the startTransition callback.
      setOptimisticStock(1);
      setHasSubmitted(true); // Mark that a purchase has been initiated

      const result = await purchaseFlashSaleItem(productId);
      
      if (!result.success) {
        // If the server action fails, React will automatically revert the optimistic state.
        // We just need to inform the user.
        alert(`Purchase failed: ${result.message}`);
        setHasSubmitted(false); // Allow the user to try again if it was a temporary error
      } else {
        // On success, we don't need to do anything to the state.
        // The `revalidatePath` in the server action will eventually cause the component
        // to re-render with the true new stock count from the server.
        // The optimistic state has already given the user instant feedback.
      }
    });
  };

  const isSoldOut = optimisticStock <= 0;
  // The button should be disabled once a successful optimistic purchase has started.
  const isDisabled = hasSubmitted || isPending || isSoldOut || !isSaleActive;

  let buttonText = "Buy Now!";
  if (isSoldOut) buttonText = "Sold Out!";
  if (!isSaleActive) buttonText = "Sale Not Active";
  // The 'Success!' state is now better handled by `hasSubmitted`
  if (hasSubmitted && !isPending && optimisticStock < initialStock) buttonText = "Purchased!";
  if (hasSubmitted && isPending) buttonText = "Processing...";


  return (
    <>
      <StockIndicatorUI stock={optimisticStock} initialStock={50} />

      <button
        onClick={handlePurchase}
        disabled={isDisabled}
        className="w-full mt-4 rounded-lg bg-blue-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
      >
        {buttonText}
      </button>
    </>
  );
}