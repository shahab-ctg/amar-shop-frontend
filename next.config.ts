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
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
