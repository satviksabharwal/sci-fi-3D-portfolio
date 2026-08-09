"use client";

import { useTranslations } from "next-intl";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

function Linkified({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN);
  return (
    <>
      {parts.map((part, i) =>
        part.match(URL_PATTERN) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-cyan underline underline-offset-2 break-all hover:text-accent-cyan/80"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const t = useTranslations("chat");
  const isUser = message.role === "user";

  if (message.kind === "link") {
    return (
      <div className="flex justify-start">
        <a
          href={message.content}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-body border border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary transition-all duration-200"
        >
          <span>📄</span>
          <span>{t("resumeLink")}</span>
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
    );
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm font-body leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-accent-violet/15 border border-accent-violet/25 text-white/90"
            : "bg-white/[0.03] border border-accent-cyan/15 text-white/80",
        )}
      >
        <Linkified text={message.content} />
      </div>
    </div>
  );
}
