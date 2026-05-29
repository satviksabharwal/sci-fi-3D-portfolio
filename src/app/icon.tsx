import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 64,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #00f5c4 0%, #7c3aed 50%, #f472b6 100%)",
        borderRadius: 13,
        padding: 2,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0f",
          borderRadius: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            fontFamily: "sans-serif",
            lineHeight: 1,
            background:
              "linear-gradient(135deg, #00f5c4 0%, #7c3aed 50%, #f472b6 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          S
        </div>
      </div>
    </div>,
    { ...size },
  );
}
