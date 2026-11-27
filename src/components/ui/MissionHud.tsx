"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

// Story order of the page — must match the section order in the locale page.
const STATIONS = ["hero", "about", "experience", "skills", "projects", "contact"] as const;
const GAP = 52; // px between stations on the rail

/**
 * The astronaut's route. Once he closes his visor in the hero, this helmet
 * marker is what "takes the visitor on the journey": it travels down the rail
 * as they scroll from station to station.
 */
export function MissionHud() {
  const t = useTranslations("mission");
  const [active, setActive] = useState(0);
  const markerRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const tops = STATIONS.map(
        (id) => document.getElementById(id)?.offsetTop ?? Infinity,
      );
      if (tops[0] === Infinity) return; // not on the story page (e.g. 404)
      const y = window.scrollY + window.innerHeight * 0.4;
      let i = 0;
      while (i < tops.length - 1 && y >= tops[i + 1]) i++;
      const end = tops[i + 1] ?? document.documentElement.scrollHeight;
      const within = Math.min(Math.max((y - tops[i]) / (end - tops[i]), 0), 1);
      const pos = Math.min(i + within, STATIONS.length - 1);
      setActive(i);
      if (markerRef.current) {
        markerRef.current.style.transform = `translateY(${pos * GAP}px)`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pos / (STATIONS.length - 1)})`;
      }
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Small screens: a thin progress line under the top edge */}
      <div className="xl:hidden fixed top-0 inset-x-0 h-0.5 z-[60] pointer-events-none">
        <div
          ref={barRef}
          className="h-full bg-accent-cyan origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Large screens: the route rail */}
      <nav
        aria-label={t("label")}
        className="hidden xl:block fixed left-7 top-1/2 z-40"
        style={{ marginTop: -((STATIONS.length - 1) * GAP) / 2 }}
      >
        <div
          className="absolute left-[5px] top-0 w-px bg-white/10"
          style={{ height: (STATIONS.length - 1) * GAP }}
        />
        <span
          ref={markerRef}
          aria-hidden="true"
          className="absolute -left-[5px] -top-[10px] w-[21px] h-[21px] rounded-full bg-bg-primary border border-accent-cyan shadow-glow-cyan flex items-center justify-center will-change-transform"
        >
          {/* helmet with the visor down */}
          <span className="w-[11px] h-[6px] rounded-full bg-accent-cyan" />
        </span>
        <ol>
          {STATIONS.map((id, i) => (
            <li
              key={id}
              className="relative flex items-center"
              style={{ height: i === STATIONS.length - 1 ? 11 : GAP, alignItems: "flex-start" }}
            >
              <a
                href={`#${id}`}
                aria-current={active === i ? "step" : undefined}
                className="group flex items-center gap-4 -mt-[5px] py-[0px]"
              >
                <span
                  className={`block w-[11px] h-[11px] rounded-full border transition-colors duration-300 ${
                    i <= active
                      ? "border-accent-cyan bg-accent-cyan/30"
                      : "border-white/25 bg-bg-primary group-hover:border-white/60"
                  }`}
                />
                <span
                  className={`text-[10px] font-mono tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-300 ${
                    active === i
                      ? "text-accent-cyan opacity-0 2xl:opacity-100 group-hover:opacity-100"
                      : "text-white/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  0{i} {t(`stations.${id}`)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* How to fly — pointer devices with a keyboard only */}
      <p className="hidden xl:block fixed left-7 bottom-6 z-40 text-[10px] font-mono tracking-[0.16em] uppercase text-white/45">
        {t("keys")}
      </p>
    </>
  );
}
