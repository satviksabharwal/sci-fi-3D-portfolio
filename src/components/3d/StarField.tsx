"use client";

import { useMemo } from "react";

const COLORS = ["#00f5c4", "#7c3aed", "#ffffff"];
const COUNT = 140;

// CSS-only stand-in for the WebGL scene on touch devices: stars are
// box-shadows on two 1px/2px elements, drifting via a single composited
// transform. No JS runs per frame and no WebGL context is created.
export function StarField() {
  const { field, small, large } = useMemo(() => {
    // Square field sized to the longer screen edge so it covers both
    // orientations without recomputing on rotate.
    const field = Math.max(window.screen.width, window.screen.height);
    const shadows: [string[], string[]] = [[], []];

    for (let i = 0; i < COUNT; i++) {
      const x = Math.round(Math.random() * field);
      const y = Math.round(Math.random() * field);
      const rand = Math.random();
      const color = COLORS[rand < 0.3 ? 0 : rand < 0.5 ? 1 : 2];
      // Each star is drawn twice, one field-height apart, so the drift
      // animation loops seamlessly.
      shadows[i % 4 === 0 ? 1 : 0].push(
        `${x}px ${y}px ${color}`,
        `${x}px ${y + field}px ${color}`,
      );
    }

    return { field, small: shadows[0].join(","), large: shadows[1].join(",") };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden animate-fade-in"
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 opacity-60 motion-safe:animate-[starDrift_140s_linear_infinite]"
        style={{ "--star-loop": `${field}px` } as React.CSSProperties}
      >
        <div
          className="absolute w-px h-px rounded-full"
          style={{ boxShadow: small }}
        />
        <div
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{ boxShadow: large }}
        />
      </div>
    </div>
  );
}
