/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable standalone output to avoid Windows symlink issues
  // output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // Keep unoptimized for Docker deployment
    unoptimized: true,
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.vercel.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "seeklogo.com",
      },
    ],
  },
};

export default nextConfig;
