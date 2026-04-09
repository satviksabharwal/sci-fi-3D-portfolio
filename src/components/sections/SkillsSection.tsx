"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SKILLS } from "@/lib/data";
import type { Skill } from "@/types";

const CATEGORIES: { key: Skill["category"]; label: string; color: string }[] = [
  { key: "frontend", label: "Frontend", color: "#00f5c4" },
  { key: "backend", label: "Backend", color: "#7c3aed" },
  { key: "tools", label: "Tools & Ops", color: "#f472b6" },
];

function SkillBar({
  skill,
  inView,
  index,
}: {
  skill: Skill;
  inView: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group"
    >
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-white/70 text-sm font-body group-hover:text-white transition-colors">
          {skill.name}
        </span>
        <span className="text-white/25 text-xs font-mono">{skill.level}%</span>
      </div>
      <div className="h-[3px] bg-white/[0.06] rounded-full overflow-visible relative">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2 + index * 0.06,
          }}
        />
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  const { ref, inView } = useScrollReveal(0.1);

  return (
    <SectionWrapper
      id="skills"
      label="02 / Skills"
      title="Tech Arsenal"
      subtitle="Tools and technologies I use to bring ideas to life at production scale."
    >
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => {
          const catSkills = SKILLS.filter((s) => s.category === cat.key);
          return (
            <div key={cat.key} className="card-sci-fi p-6 rounded-2xl">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: cat.color,
                    boxShadow: `0 0 8px ${cat.color}`,
                  }}
                />
                <span
                  className="font-display font-bold text-sm tracking-wide uppercase"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Skills */}
              <div className="space-y-5">
                {catSkills.map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    inView={inView}
                    index={i}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra tech tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12"
      >
        <p className="text-white/20 text-xs font-mono tracking-widest uppercase mb-4">
          Also worked with
        </p>
        <div className="flex flex-wrap gap-2">
          {[
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
          ].map((t) => (
            <span
              key={t}
              className="tag text-white/40 border-white/10 bg-white/[0.03]"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
