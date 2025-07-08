import { PrismaClient } from "@prisma/client";

// Initialize a new instance of the Prisma Client for this script
const prisma = new PrismaClient();

// The main function where all the seeding logic will reside
async function main() {
  // 1. Clean up existing data to make the script idempotent.
  // Idempotent means running the script multiple times will result in the same database state.
  console.log("Start seeding...");
  console.log("Deleting existing orders and products...");
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  console.log("Existing data deleted.");

  // 2. Define the product data we want to create.
  // We'll create a mix of active, upcoming, and expired deals to test all scenarios.

  const now = new Date();

  // Helper function to create dates relative to now
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const daysFromNow = (days: number) =>
    new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const productData = [
    {
      name: "Pro Gamer RGB Mouse",
      description:
        "Ultra-lightweight gaming mouse with customizable RGB lighting and a high-precision 16,000 DPI sensor. Perfect for competitive gaming.",
      imageUrl:
        "https://images.piclumen.com/normal/20250708/03/2f974e93b612410e867f8b2b334a7a23.webp",
      originalPrice: 79.99,
      salePrice: 49.99,
      stockQuantity: 50,
      saleStartsAt: daysAgo(1), // Sale started yesterday
      saleEndsAt: daysFromNow(2), // Sale ends in 2 days (ACTIVE)
    },
    {
      name: "Mechanical Keyboard (Blue Switches)",
      description:
        "A full-sized mechanical keyboard with satisfyingly clicky blue switches. Features full n-key rollover and a durable aluminum frame.",
      imageUrl:
        "https://images.piclumen.com/normal/20250708/04/6905e6a8eef04c61ab70f50aacc67394.webp",
      originalPrice: 129.99,
      salePrice: 89.99,
      stockQuantity: 30,
      saleStartsAt: daysAgo(2), // Sale started 2 days ago
      saleEndsAt: daysFromNow(1), // Sale ends tomorrow (ACTIVE)
    },
    {
      name: "4K Ultra-Wide Monitor",
      description:
        "Immerse yourself in stunning visuals with this 34-inch curved ultra-wide monitor. 144Hz refresh rate for smooth gameplay.",
      imageUrl:
        "https://images.piclumen.com/normal/20250708/04/f28d97a2ea2649f7a23d7cbe6acc6e09.webp",
      originalPrice: 799.99,
      salePrice: 599.99,
      stockQuantity: 15,
      saleStartsAt: daysFromNow(1), // Sale starts tomorrow (UPCOMING)
      saleEndsAt: daysFromNow(3),
    },
    {
      name: "Noise-Cancelling Headphones",
      description:
        "Escape the world and focus on your audio with these premium wireless noise-cancelling headphones. 30-hour battery life.",
      imageUrl:
        "https://images.piclumen.com/normal/20250708/04/0107c18cf63e45bd94ad0396fdfe3a86.webp",
      originalPrice: 249.99,
      salePrice: 179.99,
      stockQuantity: 0, // SOLD OUT
      saleStartsAt: daysAgo(3),
      saleEndsAt: daysFromNow(5),
    },
    {
      name: "Ergonomic Office Chair",
      description:
        "Stay comfortable during long work or gaming sessions with this fully adjustable ergonomic chair. Features lumbar support and a mesh back.",
      imageUrl:
        "https://images.piclumen.com/normal/20250708/04/923c2c22d3034639a04454ed630282cb.webp",
      originalPrice: 399.99,
      salePrice: 249.99,
      stockQuantity: 100,
      saleStartsAt: daysAgo(5),
      saleEndsAt: daysAgo(1), // Sale ended yesterday (EXPIRED)
    },
  ];

  // 3. Create the products in the database
  console.log(`Creating ${productData.length} products...`);
  await prisma.product.createMany({
    data: productData,
  });
  console.log("Products created successfully.");

  console.log("Seeding finished.");
}

// 4. Execute the main function and handle potential errors
main()
  .then(async () => {
    // Disconnect from the database when the script is done
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("An error occurred while seeding the database:", e);
    // Ensure disconnection even if an error occurs
    await prisma.$disconnect();
    process.exit(1);
  });
