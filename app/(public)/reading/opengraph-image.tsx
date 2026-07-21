import { createOgImage, ogImageContentType, ogImageSize } from "../../og";

export const alt = "ArcadeGhosts reading room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Reading",
    title: "Books still rustling in the signal.",
    description: "Novels, philosophy, psychology, reference books, and peculiar manuals that stayed with Jason.",
    footer: ["Reading", "Books", "ArcadeGhosts"],
    glow: "#ff6fae",
  });
}
