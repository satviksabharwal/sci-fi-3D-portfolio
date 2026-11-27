"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { EXPERIENCE } from "@/lib/data";

// The flight log reads as a journey, so it runs oldest → newest.
const WAYPOINTS = [...EXPERIENCE].reverse();


export function ExperienceSection() {
  const t = useTranslations("experience");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Whichever waypoint crosses the middle band of the viewport is "docked".
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = WAYPOINTS[active];

  return (
    <SectionWrapper
      id="experience"
      label={t("label")}
      chapter={t("chapter")}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* LEFT — pinned viewport showing where we are docked */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-[38vh]">
            <div>
              <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-white/50 mb-3">
                {t("waypoint")} 0{active + 1} / 0{WAYPOINTS.length}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="font-display font-light text-5xl xl:text-6xl text-white tracking-tight break-words">
                    <span className="text-accent-cyan">/</span>
                    {current.company}
                  </div>
                  <div className="font-mono text-sm text-white/50 mt-3">
                    {current.period}
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Route */}
              <div className="flex items-center gap-2 mt-6">
                {WAYPOINTS.map((w, i) => (
                  <span
                    key={w.id}
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      i === active
                        ? "w-12 bg-accent-cyan"
                        : i < active
                          ? "w-6 bg-accent-cyan/40"
                          : "w-6 bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — the log entries */}
        <ol className="lg:col-span-7">
          {WAYPOINTS.map((exp, i) => {
            const all = t.raw(
              `descriptions.${exp.descriptionNamespace}`,
            ) as string[];
            const expanded = open.includes(exp.id);
            // Two headline points; the rest of the log opens on request.
            const bullets = expanded ? all : all.slice(0, 2);
            return (
              <li
                key={exp.id}
                data-index={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`border-t border-white/10 py-12 lg:py-20 lg:min-h-[70vh] transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "lg:opacity-35"
                }`}
              >
                <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-accent-cyan mb-4">
                  {t("waypoint")} 0{i + 1} · {exp.period}
                </div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="font-display font-bold text-white text-2xl md:text-3xl tracking-tight">
                    {exp.role}
                  </h3>
                  {exp.current && (
                    <span className="text-[10px] font-mono px-2.5 py-1 text-accent-cyan border border-accent-cyan/40 rounded-full">
                      {t("currentBadge")}
                    </span>
                  )}
                </div>
                <div className="text-white/60 text-lg font-light mb-7">
                  {exp.company}
                </div>
                <ul className="space-y-4 mb-5">
                  {bullets.map((point, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-4 text-white/65 leading-relaxed font-light"
                    >
                      <span className="font-mono text-xs text-accent-cyan/80 pt-1.5 flex-shrink-0">
                        0{j + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                {all.length > 2 && (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setOpen((ids) =>
                        expanded ? ids.filter((id) => id !== exp.id) : [...ids, exp.id],
                      )
                    }
                    className="mb-8 text-sm text-accent-cyan border-b border-accent-cyan/40 hover:border-accent-cyan transition-colors"
                  >
                    {expanded ? t("less") : t("more")}
                  </button>
                )}
                <div className={exp.tech.length ? "flex flex-wrap gap-2" : "hidden"}>
                  {exp.tech.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}
