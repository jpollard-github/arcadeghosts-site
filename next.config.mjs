/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      // Retired 2026-07-18; temporarily preserve old Ambient bookmarks and installed start URLs.
      {
        source: "/ambient/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/ambient",
        destination: "/",
        permanent: false,
      },
    ];
  },
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
