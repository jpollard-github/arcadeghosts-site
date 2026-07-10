import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/ambient",
    name: "ArcadeGhosts Ambient",
    short_name: "AG Ambient",
    description: "A slow, haunted little display built from ArcadeGhosts signals.",
    start_url: "/ambient",
    scope: "/ambient",
    display: "fullscreen",
    orientation: "landscape",
    background_color: "#08090c",
    theme_color: "#08090c",
    icons: [
      {
        src: "/icons/ambient-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/ambient-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/ambient-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
