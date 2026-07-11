import { createOgImage, ogImageContentType, ogImageSize } from "../../og";

export const alt = "ArcadeGhosts screening room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Screening",
    title: "Screen signals that stuck around.",
    description: "Twin Peaks, Severance, horror, curious comedies, memory loops, and other resonant static.",
    footer: ["Twin Peaks", "Severance", "Horror", "ArcadeGhosts"],
    glow: "#ffcf6e",
  });
}
