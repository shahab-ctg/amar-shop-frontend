// next.config.js - DEVELOPMENT MODE (Allows all domains)
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow ALL HTTPS domains
      },
      {
        protocol: "http",
        hostname: "**", // Allow ALL HTTP domains
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      // Add other reliable image hosts
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
