"use client";

import { useInView } from "react-intersection-observer";

export function useScrollReveal(threshold = 0.15) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
  });
  return { ref, inView };
}
