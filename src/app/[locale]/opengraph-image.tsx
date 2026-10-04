import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PERSONAL } from "@/lib/data";

export const alt = PERSONAL.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "hero" });
  const role = (t.raw("roles") as string[])[0];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        backgroundColor: "#05070f",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(124,58,237,0.35), transparent 55%), radial-gradient(circle at 85% 80%, rgba(0,245,196,0.22), transparent 50%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 24,
          letterSpacing: 6,
          color: "#00f5c4",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{ width: 48, height: 2, background: "#00f5c4", marginRight: 20 }}
        />
        satviksabharwal.com
      </div>
      <div
        style={{
          marginTop: 36,
          fontSize: 104,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: -3,
          background:
            "linear-gradient(135deg, #00f5c4 0%, #a78bfa 50%, #f472b6 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {PERSONAL.name}
      </div>
      <div style={{ marginTop: 32, fontSize: 44, color: "rgba(255,255,255,0.75)" }}>
        {role}
      </div>
      <div style={{ marginTop: 20, fontSize: 28, color: "rgba(255,255,255,0.4)" }}>
        {`React · Next.js · TypeScript · ${PERSONAL.location}`}
      </div>
    </div>,
    { ...size },
  );
}
