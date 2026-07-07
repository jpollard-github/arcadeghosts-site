/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbgyh9noev0gqbue.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
