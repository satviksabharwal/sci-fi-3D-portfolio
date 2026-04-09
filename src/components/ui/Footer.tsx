"use client";

import { PERSONAL } from "@/lib/data";
import { Logo } from "./Navbar";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* S monogram badge */}
          <Logo />
          <span className="gradient-text text-xs font-mono">
            © {new Date().getFullYear()} {PERSONAL.name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/15 text-xs font-mono">
          <span>Built with</span>
          <span className="tag text-white/20 border-white/10 text-[10px]">
            Next.js
          </span>
          <span className="tag text-white/20 border-white/10 text-[10px]">
            TypeScript
          </span>
          <span className="tag text-white/20 border-white/10 text-[10px]">
            Tailwind
          </span>
          <span className="tag text-white/20 border-white/10 text-[10px]">
            Three.js
          </span>
        </div>

        <a
          href="#hero"
          className="text-xs font-mono text-white/20 hover:text-accent-cyan transition-colors flex items-center gap-1"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
