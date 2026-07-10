import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambient Solid Canvas Diagnostic",
  robots: { index: false, follow: false },
};

export default function AmbientSolidDiagnosticPage() {
  return (
    <>
      <style>{`
        html,
        body {
          width: 100%;
          height: 100%;
          min-height: 100%;
          margin: 0 !important;
          background: #000 !important;
          overflow: hidden !important;
        }

        body::before,
        body::after {
          display: none !important;
          content: none !important;
        }

        .site-logo,
        .control-room-link,
        .page-home-link,
        .site-footer {
          display: none !important;
        }
      `}</style>
      <main
        aria-label="Solid black Ambient diagnostic canvas"
        data-ambient-solid-diagnostic
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          border: 0,
          outline: 0,
          background: "#000",
          boxShadow: "none",
          filter: "none",
          overflow: "hidden",
        }}
      />
    </>
  );
}
