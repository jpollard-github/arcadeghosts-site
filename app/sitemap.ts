import type { MetadataRoute } from "next";
import { writings } from "./writings";
import { absoluteUrl } from "./seo";

const staticRoutes = [
  "",
  "/arcade",
  "/listening",
  "/reading",
  "/screening",
  "/terminal",
  "/writings",
  "/tiny-thoughts",
  "/twin-peaks-self",
  "/cats/beverly-and-lucinda",
  "/cats/thomas-jones-missy-cass",
  "/games/between-two-lodges/index.html",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route || "/"),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...writings.map((writing) => ({
      url: absoluteUrl(`/writings/${writing.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
