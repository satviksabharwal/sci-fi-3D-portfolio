"use client";

import { useEffect, useState, useId } from "react";
import { LogoSvg } from "@/components/ui/LogoSvg";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("common");
  const locale = useLocale();
  const resumeUrl =
    locale === "de"
      ? process.env.NEXT_PUBLIC_RESUME_URL_DE
      : process.env.NEXT_PUBLIC_RESUME_URL_EN;

  const LINKS = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.experience"), href: "#experience" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-0 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 select-none group">
          <Logo />
          <span className="font-display font-black text-base tracking-tight leading-none">
            <span className="gradient-text">Satvik</span>
            <span className="text-white/20 mx-1.5">·</span>
            <span className="gradient-text">Sabharwal</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setActive(l.href)}
                className={`relative text-xs tracking-widest uppercase font-body transition-colors duration-200 group ${
                  active === l.href
                    ? "text-white"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-accent-cyan transition-all duration-300 ${
                    active === l.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: language switcher + Resume CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href={resumeUrl ?? "#"}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border border-accent-cyan/40 text-accent-cyan text-xs tracking-widest uppercase font-body hover:bg-accent-cyan hover:text-bg-primary transition-all duration-200 rounded-sm"
          >
            <span>{t("nav.resume")}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M1 9L9 1M9 1H3M9 1V7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-secondary/95 backdrop-blur-xl border-t border-white/[0.06]"
          >
            <ul className="flex flex-col py-4">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => {
                      setActive(l.href);
                      setMenuOpen(false);
                    }}
                    className="block px-6 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="px-6 py-3">
                <LanguageSwitcher />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: "en" | "de") => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono tracking-widest">
      <button
        onClick={() => switchTo("en")}
        className={
          locale === "en"
            ? "text-white"
            : "text-white/30 hover:text-white/60 transition-colors"
        }
      >
        EN
      </button>
      <span className="text-white/15">·</span>
      <button
        onClick={() => switchTo("de")}
        className={
          locale === "de"
            ? "text-white"
            : "text-white/30 hover:text-white/60 transition-colors"
        }
      >
        DE
      </button>
    </div>
  );
}

export const Logo = () => {
  const gradientId = useId();
  return (
    <LogoSvg
      gradientId={gradientId}
      className="transition-transform duration-300 group-hover:scale-110"
    />
  );
};
