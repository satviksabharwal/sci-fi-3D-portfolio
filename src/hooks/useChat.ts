"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale } from "next-intl";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  kind?: "link";
};
export type ChatStatus = "idle" | "streaming" | "error" | "rateLimited";

const MAX_TURNS_SENT = 20;
const MAX_MESSAGE_CHARS = 1000;

type UseChatOptions = {
  onNavigate: (sectionId: string) => void;
};

type StreamEvent =
  | { type: "text"; text: string }
  | { type: "tool"; name: string; input: Record<string, unknown> }
  | { type: "done" }
  | { type: "error"; message: string };

export function useChat({ onNavigate }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const locale = useLocale();

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const appendAssistantText = useCallback((text: string) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      // Merge into the last assistant bubble, but never into a link card.
      if (last?.role === "assistant" && !last.kind) {
        return [...prev.slice(0, -1), { ...last, content: last.content + text }];
      }
      return [...prev, { role: "assistant", content: text }];
    });
  }, []);

  const handleTool = useCallback(
    (name: string, input: Record<string, unknown>) => {
      if (name === "navigate_to_section" && typeof input.section === "string") {
        onNavigate(input.section);
        return;
      }
      if (name === "open_resume") {
        const url =
          locale === "de"
            ? process.env.NEXT_PUBLIC_RESUME_URL_DE
            : process.env.NEXT_PUBLIC_RESUME_URL_EN;
        if (!url) return;
        // window.open fired mid-stream is usually killed by popup blockers,
        // so always render a clickable link card in the chat as well — a
        // real user click on it can never be blocked.
        window.open(url, "_blank", "noopener");
        setMessages((prev) => [...prev, { role: "assistant", content: url, kind: "link" }]);
      }
    },
    [locale, onNavigate],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!trimmed || status === "streaming") return;

      const controller = new AbortController();
      abortRef.current = controller;

      const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(nextMessages);
      setStatus("streaming");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.slice(-MAX_TURNS_SENT),
            locale,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          setStatus(response.status === 429 ? "rateLimited" : "error");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let failed = false;

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data: ")) continue;
            let event: StreamEvent;
            try {
              event = JSON.parse(line.slice(6));
            } catch {
              continue;
            }
            if (event.type === "text") appendAssistantText(event.text);
            else if (event.type === "tool") handleTool(event.name, event.input);
            else if (event.type === "error") failed = true;
          }
        }

        setStatus(failed ? "error" : "idle");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus("idle");
        } else {
          setStatus("error");
        }
      } finally {
        abortRef.current = null;
      }
    },
    [messages, status, locale, appendAssistantText, handleTool],
  );

  return { messages, status, send, stop };
}
