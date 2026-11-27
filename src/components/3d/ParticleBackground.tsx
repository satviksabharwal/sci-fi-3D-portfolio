"use client";

import { useEffect, useState } from "react";
import { StarField } from "@/components/3d/StarField";

// A cheap CSS starfield behind everything. The home page's real 3D world is
// JourneyScene (mounted by the hero); this stays as the backdrop for pages
// without it (404) and while that scene is still loading.
export function ParticleBackground() {
  // StarField reads the screen size while rendering, so it is client-only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <StarField /> : null;
}
