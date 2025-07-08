// The unused 'Suspense' import was on this line. It has been removed.
import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";

// Import our reusable components
import FlashSaleCountdown from "@/components/FlashSaleCountdown";
import PurchaseSection from "@/components/PurchaseSection";

/**
 * Fetches the core product data for a given deal ID.
 */
async function getDealProduct(dealId: string) {
  const product = await prisma.product.findUnique({
    where: { id: dealId },
  });
  return product;
}

/**
 * The main page component for a specific flash sale deal.
 */
export default async function DealPage({ params }: { params: { dealId: string } }) {
  
  const awaitedParams = await params;
  const product = await getDealProduct(awaitedParams.dealId);

  if (!product) {
    notFound();
  }

  const now = new Date();
  const isSaleActive = now >= product.saleStartsAt && now <= product.saleEndsAt;

  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          <div className="flex items-center justify-center">
            <Image 
              src={product.imageUrl}
              alt={product.name} 
              width={500}
              height={500}
              className="w-full h-auto max-h-[450px] object-contain rounded-lg shadow-xl"
              priority
            />
          </div>

          <div className="flex flex-col">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-4xl font-bold text-red-600">${product.salePrice.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              </div>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mt-auto pt-6">
              {isSaleActive ? (
                <>
                  <FlashSaleCountdown saleEndsAt={product.saleEndsAt} />
                  <PurchaseSection
                    productId={product.id}
                    initialStock={product.stockQuantity}
                    isSaleActive={isSaleActive}
                  />
                </>
              ) : (
                <div className="mt-8 rounded-lg border-2 border-dashed bg-gray-50 p-6 text-center">
                  <p className="font-semibold text-gray-700">
                    {now < product.saleStartsAt ? "This exciting deal hasn't started yet." : "This amazing deal has ended."}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check back soon for more offers!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}