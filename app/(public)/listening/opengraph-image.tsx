import { createOgImage, ogImageContentType, ogImageSize } from "../../og";

export const alt = "ArcadeGhosts listening room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Listening",
    title: "Albums still humming in the signal.",
    description: "Old favorites, newer discoveries, and records Jason keeps coming back to.",
    footer: ["Listening", "Albums", "ArcadeGhosts"],
    glow: "#29f0d4",
  });
}
