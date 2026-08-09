"use client";

import { useTranslations } from "next-intl";

export function SuggestedQuestions({ onSelect }: { onSelect: (question: string) => void }) {
  const t = useTranslations("chat");
  const suggestions = t.raw("suggestions") as string[];

  return (
    <div className="flex flex-col items-start gap-2">
      {suggestions.map((question) => (
        <button
          key={question}
          onClick={() => onSelect(question)}
          className="text-left text-xs font-body px-3 py-2 rounded-md border border-white/10 bg-white/[0.03] text-white/60 hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors duration-200"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
