"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { PERSONAL, PROJECTS } from "@/lib/data";

const Arrow = () => (
  <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function ProjectsSection() {
  const t = useTranslations("projects");

  return (
    <SectionWrapper
      id="projects"
      label={t("label")}
      chapter={t("chapter")}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <ol className="border-t border-white/10">
        {PROJECTS.map((project, i) => (
          <motion.li
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border-b border-white/10 py-9 md:py-11 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 transition-colors duration-300 hover:bg-white/[0.02]"
          >
            {/* accent bar slides in on hover */}
            <span
              className="absolute left-0 top-0 h-px w-0 group-hover:w-full transition-all duration-700"
              style={{ background: project.color }}
            />
            <div className="md:col-span-1 font-mono text-xs text-white/45 pt-2">
              P-0{i + 1}
            </div>
            <div className="md:col-span-4">
              <h3 className="font-display text-2xl md:text-[1.7rem] font-light text-white tracking-tight leading-tight group-hover:text-accent-cyan transition-colors duration-300">
                {project.title}
              </h3>
              <div className="flex gap-2 mt-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} — ${t("links.liveSite")}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent-cyan/50 text-xs text-white hover:bg-accent-cyan hover:text-bg-primary transition-colors"
                  >
                    {t("links.liveSite")} <Arrow />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} — ${t("links.github")}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white/70 hover:border-white/40 hover:text-white transition-colors"
                  >
                    {t("links.github")} <Arrow />
                  </a>
                )}
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="text-white/60 leading-relaxed font-light mb-5">
                {t(`descriptions.${project.descriptionKey}`)}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="mt-10">
        <a
          href={PERSONAL.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-accent-cyan transition-colors font-mono"
        >
          {t("links.moreOnGithub")} <Arrow />
        </a>
      </div>
    </SectionWrapper>
  );
}
