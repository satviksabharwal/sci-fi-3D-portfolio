"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

const MAX_CHARS = 1000;

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const t = useTranslations("chat");
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="flex items-end gap-2 border-t border-white/[0.06] p-3">
      <textarea
        ref={textareaRef}
        value={value}
        maxLength={MAX_CHARS}
        rows={1}
        placeholder={t("placeholder")}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        className="flex-1 resize-none bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm font-body text-white/90 placeholder:text-white/25 caret-accent-cyan focus:outline-none focus:border-accent-cyan/50 transition-colors"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label={t("send")}
        className="shrink-0 p-2.5 rounded-md bg-accent-cyan/10 border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M1.5 8L14.5 1.5L11 14.5L7.5 9.5L1.5 8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
