"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { SuggestedQuestions } from "@/components/chat/SuggestedQuestions";
import { ChatInput } from "@/components/chat/ChatInput";
import { VideoAvatarLauncher } from "@/components/chat/VideoAvatarLauncher";

export function ChatPanel({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}) {
  const t = useTranslations("chat");
  const { messages, status, send } = useChat({ onNavigate });
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastMessage = messages[messages.length - 1];
  const awaitingFirstToken = status === "streaming" && lastMessage?.role === "user";

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-40 flex flex-col overflow-hidden border border-white/[0.06] bg-bg-primary/95 backdrop-blur-xl shadow-card-hover inset-x-0 bottom-0 h-[85dvh] rounded-t-xl md:inset-x-auto md:bottom-24 md:right-6 md:h-[560px] md:max-h-[calc(100dvh-8rem)] md:w-[380px] md:rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <Image
          src="/satvik-avatar.jpg"
          alt="Satvik Sabharwal"
          width={36}
          height={36}
          className="w-9 h-9 rounded-full object-cover ring-1 ring-accent-cyan/50 select-none"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-bold text-white truncate">{t("title")}</p>
          <p className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            {t("status")}
          </p>
        </div>
        <VideoAvatarLauncher onLaunch={onClose} />
        <button
          onClick={onClose}
          aria-label={t("close")}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12L12 2M2 2l10 10" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <ChatMessage message={{ role: "assistant", content: t("greeting") }} />
        {messages.length === 0 && <SuggestedQuestions onSelect={send} />}
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
        {awaitingFirstToken && <TypingIndicator />}
        {status === "error" && (
          <p className="text-center text-xs font-mono text-accent-pink/80">{t("error")}</p>
        )}
        {status === "rateLimited" && (
          <p className="text-center text-xs font-mono text-accent-pink/80">{t("rateLimited")}</p>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={send} disabled={status === "streaming"} />
      <p className="px-4 pb-3 text-[10px] text-white/25 font-body text-center">{t("disclaimer")}</p>
    </motion.div>
  );
}
