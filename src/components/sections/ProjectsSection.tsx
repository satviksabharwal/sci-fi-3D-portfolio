"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { PROJECTS } from "@/lib/data";

export function ProjectsSection() {
  const t = useTranslations("projects");
  const [hovered, setHovered] = useState<number | null>(null);

  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <SectionWrapper
      id="projects"
      label={t("label")}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      {/* Featured projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {featured.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            onHoverStart={() => setHovered(project.id)}
            onHoverEnd={() => setHovered(null)}
            className="card-sci-fi rounded-2xl p-6 flex flex-col group cursor-none relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Animated glow on hover */}
            <AnimatePresence>
              {hovered === project.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${project.color}15, transparent 70%)`,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Top row */}
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background: `${project.color}18`,
                  border: `1px solid ${project.color}30`,
                }}
              >
                {["⬡", "◈", "⬖"][i]}
              </div>
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors"
                    title={t("links.github")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-colors"
                    title={t("links.liveSite")}
                  >
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1 9L9 1M9 1H3M9 1V7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Title & desc */}
            <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-5 flex-1">
              {t(`descriptions.${project.descriptionKey}`)}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{
                    color: `${project.color}bb`,
                    borderColor: `${project.color}25`,
                    background: `${project.color}0a`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rest of projects — horizontal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rest.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="card-sci-fi rounded-xl p-5 flex items-start gap-4 hover:scale-[1.01] transition-transform duration-300 group"
          >
            <div
              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
              style={{
                background: project.color,
                boxShadow: `0 0 8px ${project.color}`,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-display font-bold text-sm text-white">
                  {project.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/20 hover:text-white/60 transition-colors text-xs font-mono"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </div>
              <p className="text-white/30 text-xs leading-relaxed mb-3">
                {t(`descriptions.${project.descriptionKey}`)}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono text-white/25 border border-white/10 px-1.5 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* More work CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.4 }}
        className="text-center mt-10"
      >
        <a
          href="https://github.com/satviksabharwal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/70 transition-colors font-mono"
        >
          <span>{t("links.moreOnGithub")}</span>
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <path
              d="M1 9L9 1M9 1H3M9 1V7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
