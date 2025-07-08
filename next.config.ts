// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this 'images' configuration block
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        // You can optionally specify port and pathname if needed for more security
        // port: '',
        // pathname: '/assets/**',
      },
      // You can add more trusted domains here in the future
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.my-other-source.com',
      // },
    ],
  },

  // (Optional) Add any other configurations you have, like the experimental React Compiler
  experimental: {
    // reactCompiler: true,
  },
};

export default nextConfig;
