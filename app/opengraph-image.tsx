import { ImageResponse } from "next/og";

export const alt = "ArcadeGhosts by Jason Pollard";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 18% 20%, #f7b955 0, transparent 28%), linear-gradient(135deg, #111827 0%, #16213a 48%, #102b27 100%)",
          color: "#f8efe3",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
            color: "#29f0d4",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Jason Pollard
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 0.95,
              maxWidth: 900,
            }}
          >
            ArcadeGhosts
          </div>
          <div
            style={{
              maxWidth: 860,
              fontSize: 34,
              lineHeight: 1.25,
              color: "#f8efe3",
            }}
          >
            Projects, writing, cats, music, arcade nostalgia, and strange little
            experiments from the neon forest.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 28, color: "#ffcf6e" }}>
          <span>Projects</span>
          <span>Writing</span>
          <span>Arcades</span>
          <span>Cats</span>
        </div>
      </div>
    ),
    size,
  );
}
