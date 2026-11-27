"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SKILLS } from "@/lib/data";
import type { Skill } from "@/types";

const CATEGORIES: { key: Skill["category"]; labelKey: string }[] = [
  { key: "frontend", labelKey: "categories.frontend" },
  { key: "backend", labelKey: "categories.backend" },
  { key: "tools", labelKey: "categories.tools" },
];

const ALSO = [
  "Redux",
  "Zustand",
  "React Query",
  "i18next",
  "Vitest",
  "Jest",
  "Visx",
  "D3.js",
  "Prettier",
  "ESLint",
  "PNPM",
  "Yarn",
  "NPM",
  "Figma",
];

function SkillGauge({
  skill,
  inView,
  index,
}: {
  skill: Skill;
  inView: boolean;
  index: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2.5">
        <span className="text-white/85 text-sm">{skill.name}</span>
        <span className="text-white/45 text-xs font-mono">{skill.level}%</span>
      </div>
      <div className="h-px bg-white/10 relative">
        <motion.div
          className="absolute left-0 -top-px h-[3px] rounded-full bg-accent-cyan origin-left"
          style={{ width: `${skill.level}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1 + index * 0.06,
          }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  const t = useTranslations("skills");
  const { ref, inView } = useScrollReveal(0.1);

  return (
    <SectionWrapper
      id="skills"
      label={t("label")}
      chapter={t("chapter")}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      {/* AI-native capabilities: described, not scored — a percentage would
          say little about how someone works with AI. */}
      <div className="mb-20">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/10 pb-4 mb-2">
          <span className="font-mono text-xs text-accent-cyan">01</span>
          <h3 className="font-display font-bold text-white text-xl tracking-tight">
            {t("ai.label")}
          </h3>
          <p className="text-white/55 text-sm font-light">{t("ai.lead")}</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12">
          {(t.raw("ai.items") as { name: string; desc: string }[]).map((item) => (
            <li key={item.name} className="border-b border-white/10 py-5">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                <span className="font-display font-bold text-white">{item.name}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed font-light">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-14">
        {CATEGORIES.map((cat, c) => (
          <div key={cat.key}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-7">
              <span className="font-mono text-xs text-accent-cyan">0{c + 2}</span>
              <h3 className="font-display font-bold text-white tracking-tight">
                {t(cat.labelKey)}
              </h3>
            </div>
            <div className="space-y-6">
              {SKILLS.filter((s) => s.category === cat.key).map((skill, i) => (
                <SkillGauge key={skill.name} skill={skill} inView={inView} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="text-white/50 text-[11px] font-mono tracking-[0.22em] uppercase mb-4">
          {t("alsoWorkedWith")}
        </p>
        <div className="flex flex-wrap gap-2">
          {ALSO.map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
