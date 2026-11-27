"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { PERSONAL } from "@/lib/data";

type EducationEntry = {
  degree: string;
  school: string;
  year: string;
};

type ValueEntry = {
  title: string;
  desc: string;
};

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

export function AboutSection() {
  const t = useTranslations("about");
  const education = t.raw("education") as EducationEntry[];
  const values = t.raw("values") as ValueEntry[];

  return (
    <SectionWrapper
      id="about"
      label={t("label")}
      chapter={t("chapter")}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-start">
        {/* LEFT — Story */}
        <div className="lg:col-span-3 space-y-10">
          <motion.div
            {...reveal()}
            className="space-y-5 text-white/60 leading-relaxed text-[1.05rem] font-light"
          >
            <p>
              {t.rich("bio1", {
                strong: (chunks) => (
                  <span className="text-white font-normal">{chunks}</span>
                ),
                cyan: (chunks) => (
                  <span className="text-accent-cyan">{chunks}</span>
                ),
              })}
            </p>
          </motion.div>

          {/* Education */}
          <motion.div {...reveal(0.1)}>
            <h3 className="text-[11px] tracking-[0.22em] uppercase font-mono text-white/50 mb-2">
              {t("educationLabel")}
            </h3>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {education.map((e) => (
                <li
                  key={e.degree}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <div>
                    <div className="font-display font-bold text-white">
                      {e.degree}
                    </div>
                    <div className="text-white/50 text-sm">{e.school}</div>
                  </div>
                  <div className="text-accent-cyan font-mono text-xs">
                    {e.year}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Location / links */}
          <motion.div {...reveal(0.15)} className="flex flex-wrap gap-3">
            <span className="tag">{PERSONAL.location}</span>
            {[
              { label: t("links.github"), href: PERSONAL.github },
              { label: t("links.linkedin"), href: PERSONAL.linkedin },
              { label: t("links.email"), href: `mailto:${PERSONAL.email}` },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tag hover:border-accent-cyan hover:text-accent-cyan transition-colors"
              >
                {item.label} ↗
              </a>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Values */}
        <ul className="lg:col-span-2 flex flex-wrap lg:flex-col gap-3">
          {values.map((v, i) => (
            <motion.li
              key={v.title}
              {...reveal(i * 0.06)}
              className="flex items-baseline gap-4 rounded-full border border-white/10 bg-bg-primary/60 backdrop-blur-sm px-5 py-3"
            >
              <span className="font-mono text-xs text-accent-cyan">0{i + 1}</span>
              <span className="font-display font-bold text-white">{v.title}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
