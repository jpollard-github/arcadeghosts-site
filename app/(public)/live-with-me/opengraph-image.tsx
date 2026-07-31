import { createOgImage, ogImageContentType, ogImageSize } from "../../og";

export const alt = "Live With Me, an honest signal from Jason Pollard";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "For one specific person, eventually.",
    title: "Live with me.",
    description: "Not immediately. Let’s have dinner first.",
    footer: ["Not an application", "An honest signal"],
    glow: "#ffc66d",
  });
}
