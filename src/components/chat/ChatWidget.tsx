"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { cn } from "@/lib/utils";

const isMobileViewport = () => window.matchMedia("(max-width: 767px)").matches;

export function ChatWidget() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);

  // The mobile panel is a near-fullscreen sheet — lock page scroll behind it.
  useEffect(() => {
    if (open && isMobileViewport()) {
      document.body.classList.add("overflow-hidden");
      return () => document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  const handleNavigate = useCallback((sectionId: string) => {
    const scroll = () =>
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    if (isMobileViewport()) {
      // Close the sheet first so the visitor can see the page move.
      setOpen(false);
      setTimeout(scroll, 300);
    } else {
      scroll();
    }
  }, []);

  return (
    <div className="cursor-auto [&_button]:cursor-pointer [&_a]:cursor-pointer [&_textarea]:cursor-text">
      <AnimatePresence>
        {open && <ChatPanel onClose={() => setOpen(false)} onNavigate={handleNavigate} />}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={t("launcherLabel")}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-glow-cyan flex items-center justify-center",
          open
            ? "bg-gradient-to-br from-accent-cyan to-accent-violet text-bg-primary"
            : "ring-2 ring-accent-cyan/70",
        )}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 15L15 5M5 5l10 10" strokeLinecap="round" />
          </svg>
        ) : (
          <Image
            src="/satvik-avatar.jpg"
            alt=""
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover select-none"
          />
        )}
        {!open && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-accent-cyan border-2 border-bg-primary animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
