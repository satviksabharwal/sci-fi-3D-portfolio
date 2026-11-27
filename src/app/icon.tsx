import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon: the same helmet mark as LogoSvg, drawn with boxes for next/og.
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 64,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#090a0c",
        borderRadius: 14,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          border: "4px solid #e8ecf1",
          background: "#0f1114",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 19,
            borderRadius: 10,
            background: "#5fd9c9",
            marginTop: -3,
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
