"use client";

import { useTranslations } from "next-intl";
import { PERSONAL } from "@/lib/data";
import { Logo } from "./Navbar";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="relative z-10 border-t border-white/[0.05] pt-10 pb-28 md:pb-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-white/60 text-xs font-mono">
            © {new Date().getFullYear()} {PERSONAL.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-white/50 text-xs font-mono">
          <span>{t("footer.builtWith")}</span>
          <span className="tag text-[10px]">
            Next.js
          </span>
          <span className="tag text-[10px]">
            TypeScript
          </span>
          <span className="tag text-[10px]">
            Tailwind
          </span>
          <span className="tag text-[10px]">
            Three.js
          </span>
        </div>

        <a
          href="#hero"
          className="text-xs font-mono text-white/50 hover:text-accent-cyan transition-colors flex items-center gap-1"
        >
          {t("footer.backToTop")} ↑
        </a>
      </div>
    </footer>
  );
}
