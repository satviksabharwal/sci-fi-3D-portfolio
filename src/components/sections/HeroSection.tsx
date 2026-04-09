"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { TypeAnimation } from "react-type-animation";
import { PERSONAL } from "@/lib/data";

const Avatar3D = dynamic(
  () => import("@/components/3d/Avatar3D").then((m) => m.Avatar3D),
  { ssr: false, loading: () => <div className="w-[320px] h-[380px]" /> },
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden"
    >
      {/* Radial hero glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-accent-violet/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-cyan/8 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LEFT — Text */}
        <div>
          {/* Status pill */}
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
            </span>
            <span className="text-xs tracking-widest text-accent-cyan uppercase font-mono">
              Available for opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.div {...fadeUp(0.1)}>
            <h1 className="font-display font-black leading-[0.95] tracking-tight mb-4">
              <span className="block text-white/20 text-xl mb-2 font-body font-light tracking-widest uppercase">
                Hi, I'm
              </span>
              <span className="block text-5xl md:text-6xl xl:text-7xl gradient-text">
                {PERSONAL.name}
              </span>
            </h1>
          </motion.div>

          {/* Typewriter role */}
          <motion.div {...fadeUp(0.2)} className="h-14 flex items-center mb-6">
            <span className="text-2xl md:text-3xl text-white/60 font-display font-semibold tracking-tight">
              <TypeAnimation
                sequence={[
                  "Frontend Engineer",
                  2500,
                  "React Specialist",
                  2000,
                  "Analytics Enthusiast",
                  2000,
                  "Performance Nerd",
                  2000,
                  "Accessibility Advocate",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
              <span className="inline-block w-0.5 h-7 bg-accent-cyan ml-1 align-middle animate-pulse" />
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            {...fadeUp(0.3)}
            className="text-white/40 text-lg leading-relaxed max-w-lg mb-10"
          >
            {PERSONAL.bio}
          </motion.p>

          {/* CTA row */}
          <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-4 mb-14">
            <a
              href="#projects"
              className="px-6 py-3 bg-accent-cyan text-bg-primary font-body font-medium text-sm hover:brightness-110 transition-all duration-200 rounded-sm glow-cyan"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-white/10 text-white/70 font-body text-sm hover:bg-accent-cyan/80 hover:text-white transition-all duration-200 rounded-sm"
            >
              Get In Touch
            </a>
            <a
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/10 text-white/70 font-body text-sm hover:bg-accent-cyan/80 hover:text-white transition-all duration-200 rounded-sm flex items-center gap-2"
            >
              <GithubIcon />
              GitHub
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.5)} className="flex gap-10">
            {[
              { value: "6+", label: "Years Experience" },
              { value: "20+", label: "Projects Shipped" },
              { value: "3", label: "Companies" },
              { value: "2", label: "Degrees" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display font-black text-2xl gradient-text-cyan">
                  {s.value}
                </div>
                <div className="text-white/30 text-xs tracking-wide mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — 3D Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col items-center justify-center relative"
        >
          {/* Orbit ring */}
          <div className="absolute w-[340px] h-[340px] rounded-full border border-accent-cyan/10 animate-spin-slow" />
          <div
            className="absolute w-[280px] h-[280px] rounded-full border border-accent-violet/10"
            style={{ animation: "spin 14s linear infinite reverse" }}
          />

          {/* Corner brackets */}
          <div className="absolute top-0 left-16 w-6 h-6 border-t border-l border-accent-cyan/40" />
          <div className="absolute top-0 right-16 w-6 h-6 border-t border-r border-accent-cyan/40" />
          <div className="absolute bottom-4 left-16 w-6 h-6 border-b border-l border-accent-cyan/40" />
          <div className="absolute bottom-4 right-16 w-6 h-6 border-b border-r border-accent-cyan/40" />

          <Avatar3D />

          {/* Scan line label */}
          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono tracking-widest">
            <span
              className="w-6 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, #00f5c4)",
              }}
            />
            <span
              style={{
                color: "#00f5c4",
                textShadow:
                  "0 0 6px #00f5c4, 0 0 14px #00f5c4, 0 0 30px rgba(0,245,196,0.6), 0 0 60px rgba(0,245,196,0.25)",
                animation: "neonFlicker 4s ease-in-out infinite",
              }}
            >
              RENDERING FRONTEND.DEV_v2.0
            </span>
            <span
              className="w-6 h-px"
              style={{
                background: "linear-gradient(90deg, #00f5c4, transparent)",
              }}
            />
          </div>
          <style>{`
            @keyframes neonFlicker {
              0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                text-shadow: 0 0 6px #00f5c4, 0 0 14px #00f5c4, 0 0 30px rgba(0,245,196,0.6), 0 0 60px rgba(0,245,196,0.25);
                opacity: 1;
              }
              20%, 24%, 55% {
                text-shadow: none;
                opacity: 0.6;
              }
            }
          `}</style>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
