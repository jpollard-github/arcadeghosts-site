import { createOgImage, ogImageContentType, ogImageSize } from "./og";
import { defaultOgImageAlt, siteConfig } from "./seo";

export const alt = defaultOgImageAlt;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: siteConfig.name,
    title: siteConfig.socialTitle,
    description: siteConfig.description,
    footer: ["Writing", "Games", "Listening", "Screening", "Reading", "Cats"],
    glow: "#29f0d4",
  });
}
