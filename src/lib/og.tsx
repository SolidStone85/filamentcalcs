import { ImageResponse } from "next/og";

// Shared Open Graph card renderer. Every page's opengraph-image.tsx is a
// thin wrapper around this so link previews (Reddit, Discord, X, Slack)
// stay consistent: dark matte, teal accent, hex mark, big title.
// Satori constraints: flexbox only, no external assets, inline SVG ok.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type CardProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

const TEAL = "#22d3ee";
const TEAL_DIM = "#0e7490";

function HexMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2 L29 9.5 L29 22.5 L16 30 L3 22.5 L3 9.5 Z" fill={TEAL} />
      <path
        d="M16 8 L23.5 12.25 L23.5 19.75 L16 24 L8.5 19.75 L8.5 12.25 Z"
        fill="rgba(255,255,255,0.28)"
      />
    </svg>
  );
}

export function renderOgCard({ eyebrow, title, subtitle }: CardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(ellipse 900px 500px at 82% 8%, rgba(34, 211, 238, 0.16), rgba(9, 9, 11, 0))",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Oversized hex mark bleeding off the right edge as brand texture */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: -140,
            top: 90,
            opacity: 0.14,
          }}
        >
          <HexMark size={560} />
        </div>

        {/* Teal baseline accent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            backgroundColor: TEAL_DIM,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px 56px",
            width: "100%",
          }}
        >
          {/* Wordmark row */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <HexMark size={52} />
            <div style={{ display: "flex", fontSize: 34, color: "#fafafa" }}>
              <span style={{ fontWeight: 700 }}>filamentcalcs</span>
              <span style={{ color: "#71717a" }}>.com</span>
            </div>
          </div>

          {/* Title block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 940,
            }}
          >
            {eyebrow && (
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: TEAL,
                  textTransform: "uppercase",
                  letterSpacing: 4,
                }}
              >
                {eyebrow}
              </div>
            )}
            <div
              style={{
                display: "flex",
                fontSize: title.length > 46 ? 58 : 68,
                fontWeight: 700,
                color: "#fafafa",
                lineHeight: 1.12,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  color: "#a1a1aa",
                  lineHeight: 1.35,
                  maxWidth: 860,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Trust line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 25,
              color: "#71717a",
            }}
          >
            <span style={{ color: TEAL }}>Free</span>
            <span>·</span>
            <span>No sign-up</span>
            <span>·</span>
            <span>Runs in your browser</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
