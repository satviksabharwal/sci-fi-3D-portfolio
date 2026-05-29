"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PERSONAL } from "@/lib/data";

type EducationEntry = {
  degree: string;
  school: string;
  year: string;
  icon: string;
};

type ValueEntry = {
  icon: string;
  title: string;
  desc: string;
};

export function AboutSection() {
  const t = useTranslations("about");
  const { ref: cardsRef, inView: cardsInView } = useScrollReveal();

  const education = t.raw("education") as EducationEntry[];
  const values = t.raw("values") as ValueEntry[];

  return (
    <SectionWrapper
      id="about"
      label={t("label")}
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* LEFT — Story */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7 }}
            className="space-y-5 text-white/50 leading-relaxed text-[1.05rem]"
          >
            <p>
              {t.rich("bio1", {
                strong: (chunks) => (
                  <span className="text-white/80">{chunks}</span>
                ),
              })}
            </p>
            <p>
              {t.rich("bio2", {
                cyan: (chunks) => (
                  <span className="text-accent-cyan">{chunks}</span>
                ),
              })}
            </p>
            <p>{t("bio3")}</p>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h3 className="text-xs tracking-widest uppercase font-mono text-white/30 mb-4">
              {t("educationLabel")}
            </h3>
            <div className="space-y-3">
              {education.map((e) => (
                <div
                  key={e.degree}
                  className="card-sci-fi flex items-center gap-4 p-4 rounded-lg transition-all duration-300"
                >
                  <span className="text-2xl">{e.icon}</span>
                  <div className="flex-1">
                    <div className="font-display font-bold text-white text-sm">
                      {e.degree}
                    </div>
                    <div className="text-white/40 text-xs">{e.school}</div>
                  </div>
                  <div className="text-accent-cyan font-mono text-xs">
                    {e.year}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Location / links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            {[
              { label: "📍 " + PERSONAL.location, href: null },
              { label: t("links.github"), href: PERSONAL.github },
              { label: t("links.linkedin"), href: PERSONAL.linkedin },
              { label: t("links.email"), href: `mailto:${PERSONAL.email}` },
            ].map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tag hover:bg-accent-cyan/15 transition-colors"
                >
                  {item.label} ↗
                </a>
              ) : (
                <span key={item.label} className="tag opacity-60">
                  {item.label}
                </span>
              ),
            )}
          </motion.div>
        </div>

        {/* RIGHT — Values grid */}
        <div ref={cardsRef} className="lg:col-span-2 grid grid-cols-1 gap-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, x: 30 }}
              animate={cardsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-sci-fi p-5 rounded-xl group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{v.icon}</span>
                <div>
                  <div className="font-display font-bold text-white text-sm mb-1">
                    {v.title}
                  </div>
                  <div className="text-white/40 text-xs leading-relaxed">
                    {v.desc}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
