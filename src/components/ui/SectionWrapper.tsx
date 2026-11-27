"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  /** Mono log line, e.g. "Log 02 · Career trajectory" */
  label: string;
  /** Mission chapter word shown as "/Flight log" */
  chapter: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({
  id,
  label,
  chapter,
  title,
  subtitle,
  children,
  className,
}: SectionWrapperProps) {
  const { ref, inView } = useScrollReveal();

  return (
    <>
      {/* Open space between stations: this is where the flight is on show. */}
      <div aria-hidden="true" className="h-[40vh] lg:h-[70vh]" />
      <section id={id} className={cn("py-24 md:py-32 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-white/50 text-[11px] tracking-[0.22em] uppercase font-mono">
              {label}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p
            aria-hidden="true"
            className="font-display font-light text-accent-cyan text-5xl md:text-7xl tracking-tight leading-none mb-6 break-words hyphens-auto"
          >
            /{chapter}
          </p>
          {/* hyphens-auto + break-words: long German words (e.g.
              "zusammenarbeiten") must wrap instead of forcing h-scroll */}
          <h2 className="font-display font-bold text-white text-2xl md:text-3xl tracking-tight mb-3 break-words hyphens-auto">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/55 text-lg font-light max-w-xl">{subtitle}</p>
          )}
        </motion.div>
        {children}
      </div>
      </section>
    </>
  );
}
