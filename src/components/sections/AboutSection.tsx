"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PERSONAL } from "@/lib/data";

const EDUCATION = [
  {
    degree: "MSc Web Engineering",
    school: "Technische Universität Chemnitz",
    year: "2021 – 2024",
    icon: "🎓",
  },
  {
    degree: "B.Tech Computer Science",
    school: "Reva University",
    year: "2015 – 2019",
    icon: "🖥️",
  },
];

const VALUES = [
  {
    icon: "🤖",
    title: "AI-Native Builder",
    desc: "I build high-quality products at speed using AI agents — writing precise prompts, reviewing and owning every line of generated code, and knowing exactly when to guide the model versus take the wheel myself.",
  },
  {
    icon: "🎯",
    title: "Product-Minded Engineer",
    desc: "I think beyond the component - obsessing over user flows, feedback loops, and the small details that make complex products feel simple. Good code ships features; great product thinking ships experiences.",
  },
  {
    icon: "📊",
    title: "Data Visualization Expert",
    desc: "I turn complex datasets into intuitive, interactive dashboards using D3.js and Visx. Making data legible and beautiful is as important to me as making it accurate.",
  },
  {
    icon: "⚡",
    title: "Performance First",
    desc: "I obsess over Core Web Vitals, bundle sizes, and paint timelines — especially critical in data-heavy and analytics applications where rendering bottlenecks kill user trust.",
  },
  {
    icon: "🔬",
    title: "Quality Engineer Mindset",
    desc: "I write strongly-typed, well-tested code with a product instinct grounded in metrics. I read logs, interpret A/B results, and use data to drive UI decisions — not just intuition.",
  },
];

export function AboutSection() {
  const { ref: cardsRef, inView: cardsInView } = useScrollReveal();

  return (
    <SectionWrapper
      id="about"
      label="01 / About"
      title="Who I Am"
      subtitle="A developer who cares deeply about craft, performance, and the humans using what I build."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* LEFT — Story */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5 text-white/50 leading-relaxed text-[1.05rem]"
          >
            <p>
              I'm a frontend engineer with{" "}
              <span className="text-white/80">6+ years of experience</span>{" "}
              turning complex product challenges into clean, performant, and
              delightful interfaces. I've worked across e-commerce and social
              networking platforms, owning both the customer-facing experiences
              users interact with and the admin dashboards that surface deep
              analytics insights to the teams running the show.
            </p>
            <p>
              My academic background in{" "}
              <span className="text-accent-cyan">Web Engineering</span> (MSc)
              and <span className="text-accent-cyan">Computer Science</span>{" "}
              (BTech) gave me a strong theoretical foundation — but it's years
              of shipping real products under real constraints that shaped how I
              think about software.
            </p>
            <p>
              I care about the intersection of engineering rigor and aesthetic
              quality. I've collaborated closely with designers, product
              managers, and backend engineers to build experiences that users
              love and systems that teams can maintain.If you're building
              something ambitious, I'd love to be part of it.
            </p>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h3 className="text-xs tracking-widest uppercase font-mono text-white/30 mb-4">
              Education
            </h3>
            <div className="space-y-3">
              {EDUCATION.map((e) => (
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
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            {[
              { label: "📍 " + PERSONAL.location, href: null },
              { label: "GitHub", href: PERSONAL.github },
              { label: "LinkedIn", href: PERSONAL.linkedin },
              { label: "Email", href: `mailto:${PERSONAL.email}` },
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
          {VALUES.map((v, i) => (
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
