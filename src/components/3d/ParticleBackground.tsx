"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { StarField } from "@/components/3d/StarField";

const ParticleScene = dynamic(
  () => import("@/components/3d/ParticleScene").then((m) => m.ParticleScene),
  { ssr: false },
);

// The background is purely decorative, so it must never compete with
// hydration or first paint:
// - Touch devices get a CSS-only starfield. Creating the WebGL context and
//   compiling shaders blocks a mid-range phone's main thread for ~1s.
// - Everything else gets the Three.js scene, fetched as a separate chunk once
//   the page has loaded and the main thread is idle.
export function ParticleBackground() {
  const [mode, setMode] = useState<"none" | "css" | "webgl">("none");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setMode("css");
      return;
    }

    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setMode("webgl"), {
          timeout: 4000,
        });
      } else {
        timeoutId = setTimeout(() => setMode("webgl"), 2000);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId) window.cancelIdleCallback(idleId);
      clearTimeout(timeoutId);
    };
  }, []);

  if (mode === "css") return <StarField />;
  if (mode === "webgl") return <ParticleScene />;
  return null;
}
