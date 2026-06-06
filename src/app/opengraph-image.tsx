import { ImageResponse } from "next/og";

// Route segment config
export const alt =
  "iidev Studio — Web Design & SEO for Malaysian businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(16,185,129,0.18), transparent 45%), radial-gradient(circle at 85% 90%, rgba(79,70,229,0.18), transparent 45%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#FFFFFF" }}>
            iidev studio
          </div>
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 12,
              backgroundColor: "#10B981",
              marginLeft: 6,
              marginTop: 18,
            }}
          />
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 950,
            }}
          >
            High-performance websites that bring in customers.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#A3A3A3",
              marginTop: 28,
            }}
          >
            Web design &amp; SEO for Malaysian service businesses.
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            color: "#10B981",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          iidevstudio.com
        </div>
      </div>
    ),
    { ...size }
  );
}
