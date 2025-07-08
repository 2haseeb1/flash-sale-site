import { PrismaClient } from "@prisma/client";

// This file creates a single, reusable instance of the Prisma Client.

// We declare a global variable `prisma` on the `globalThis` object.
// In TypeScript, we need to explicitly declare custom global variables.
declare global {
  // The type `undefined | ReturnType<typeof prismaClientSingleton>` means it can either be
  // undefined (initially) or the type returned by our singleton function.
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// This function simply creates a new instance of PrismaClient.
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// If `globalThis.prisma` already has a value, we use it.
// If not (which happens the very first time this code runs), we call our function to create it.
// The `??` operator (Nullish Coalescing) is perfect for this.
const prisma = globalThis.prisma ?? prismaClientSingleton();

// In development, Next.js's hot-reloading feature clears the Node.js module cache on every file change.
// This would cause a new PrismaClient instance to be created on every reload,
// quickly exhausting database connections.
// To prevent this, we store the single instance on the `globalThis` object,
// which is not affected by hot-reloading.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Finally, we export the single, shared instance for use throughout the application.
export default prisma;
