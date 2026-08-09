"use client";

import { useTranslations } from "next-intl";

const WIDGET_SRC = "https://cdn.runwayml.com/v1/embeds/widget.js";

/**
 * Loads the Runway Characters widget on demand (first click). The pub key is
 * public by design — security comes from the origin allowlist configured in
 * the Runway portal's Embed tab. Rendered only when the env var is set, so
 * the site works without any Runway setup.
 */
export function VideoAvatarLauncher({ onLaunch }: { onLaunch: () => void }) {
  const t = useTranslations("chat");
  const pubKey = process.env.NEXT_PUBLIC_RUNWAY_PUB_KEY;

  if (!pubKey) return null;

  const launch = () => {
    onLaunch();
    if (!document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = WIDGET_SRC;
      script.dataset.pubKey = pubKey;
      document.body.appendChild(script);
    }
  };

  return (
    <button
      onClick={launch}
      title={t("videoCallHint")}
      aria-label={t("videoCall")}
      className="p-2 rounded-md border border-accent-violet/40 text-accent-violet hover:bg-accent-violet hover:text-bg-primary transition-all duration-200"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="3"
          width="9.5"
          height="10"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10.5 6.5L15 4V12L10.5 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
