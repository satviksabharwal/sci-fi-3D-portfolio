"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { EXPERIENCE } from "@/lib/data";

export function ExperienceSection() {
  const t = useTranslations("experience");
  const [expanded, setExpanded] = useState<number>(1);

  return (
    <SectionWrapper
      id="experience"
      label={t("label")}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-1 hidden lg:flex flex-col items-center pt-2">
          <div className="w-px flex-1 timeline-line" />
        </div>

        {/* Entries */}
        <div className="lg:col-span-11 space-y-4">
          {EXPERIENCE.map((exp, i) => {
            const bullets = t.raw(
              `descriptions.${exp.descriptionNamespace}`,
            ) as string[];

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <button
                  onClick={() => setExpanded(expanded === exp.id ? 0 : exp.id)}
                  className="w-full text-left card-sci-fi rounded-2xl p-6 hover:border-white/15 transition-all duration-300 group cursor-none"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Dot */}
                      <div className="relative flex-shrink-0 mt-1.5">
                        <div
                          className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                            expanded === exp.id
                              ? "bg-accent-cyan border-accent-cyan"
                              : "bg-transparent border-white/20 group-hover:border-white/40"
                          }`}
                        />
                        {expanded === exp.id && (
                          <div className="absolute inset-0 rounded-full bg-accent-cyan animate-ping opacity-30" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display font-bold text-white text-lg">
                            {exp.role}
                          </h3>
                          {exp.current && (
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 rounded">
                              {t("currentBadge")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-white/50 text-sm">
                            {exp.company}
                          </span>
                          <span className="text-white/15">·</span>
                          <span className="text-white/30 text-xs font-mono">
                            {exp.period}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expand chevron */}
                    <motion.div
                      animate={{ rotate: expanded === exp.id ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-white/20 group-hover:text-white/40 flex-shrink-0 mt-1"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 6l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expanded === exp.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-5 pl-7 space-y-4">
                          {/* Bullet points */}
                          <ul className="space-y-2">
                            {bullets.map((point, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.08 }}
                                className="flex items-start gap-3 text-white/50 text-sm leading-relaxed"
                              >
                                <span className="text-accent-cyan mt-1.5 flex-shrink-0">
                                  ›
                                </span>
                                {point}
                              </motion.li>
                            ))}
                          </ul>

                          {/* Tech used */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {exp.tech.map((tech) => (
                              <span
                                key={tech}
                                className="tag text-white/40 border-white/10 bg-white/[0.03]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
