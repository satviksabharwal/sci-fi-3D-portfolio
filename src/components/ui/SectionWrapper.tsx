"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({
  id,
  label,
  title,
  subtitle,
  children,
  className,
}: SectionWrapperProps) {
  const { ref, inView } = useScrollReveal();

  return (
    <section id={id} className={cn("py-28 px-6 grid-bg", className)}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-accent-cyan" />
            <span className="text-accent-cyan text-xs tracking-[0.2em] uppercase font-mono">
              {label}
            </span>
          </div>
          {/* Title */}
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/40 text-lg max-w-xl">{subtitle}</p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
