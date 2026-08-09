import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/knowledge/satvik";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TURNS = 20;
const MAX_MESSAGE_CHARS = 1000;
const MAX_ITERATIONS = 3;

// Kimi (Moonshot AI) exposes an OpenAI-compatible API.
const KIMI_BASE_URL = "https://api.moonshot.ai/v1";
const KIMI_MODEL = process.env.KIMI_MODEL ?? "kimi-k2.6";

const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY ?? "unset",
  baseURL: KIMI_BASE_URL,
});

const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "navigate_to_section",
      description:
        "Scroll the visitor's page to a section of Satvik's portfolio. Call this when the visitor asks to see or learn about his projects, skills, work experience, background/about, or how to contact him.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["hero", "about", "skills", "projects", "experience", "contact"],
            description: "The page section to scroll to.",
          },
        },
        required: ["section"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_resume",
      description:
        "Open Satvik's resume (CV) in a new browser tab, in the visitor's language. Call this when the visitor asks for the resume or CV.",
      parameters: { type: "object", properties: {} },
    },
  },
];

type IncomingMessage = { role: "user" | "assistant"; content: string };

function parseBody(body: unknown): { messages: IncomingMessage[]; locale: "en" | "de" } | null {
  if (typeof body !== "object" || body === null) return null;
  const { messages, locale } = body as { messages?: unknown; locale?: unknown };
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_TURNS) return null;

  const parsed: IncomingMessage[] = [];
  for (const entry of messages) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0 || content.length > MAX_MESSAGE_CHARS) {
      return null;
    }
    parsed.push({ role, content });
  }
  if (parsed[parsed.length - 1].role !== "user") return null;

  return { messages: parsed, locale: locale === "de" ? "de" : "en" };
}

type AccumulatedToolCall = { id: string; name: string; argumentsJson: string };

export async function POST(request: Request) {
  if (process.env.CHAT_DISABLED) {
    return Response.json({ error: "chat_disabled" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return Response.json({ error: "rate_limited", reason: limit.reason }, { status: 429 });
  }

  let parsed: ReturnType<typeof parseBody>;
  try {
    parsed = parseBody(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const { messages, locale } = parsed;

  if (!process.env.MOONSHOT_API_KEY) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          {
            role: "system",
            content:
              buildSystemPrompt().cached +
              "\n\n" +
              (locale === "de"
                ? "Locale: de — answer in German (du-Form)."
                : "Locale: en — answer in English."),
          },
          ...messages,
        ];

        for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
          const completion = await client.chat.completions.create({
            model: KIMI_MODEL,
            messages: history,
            tools: TOOLS,
            stream: true,
            max_completion_tokens: 1024,
            // Moonshot extension (not in the OpenAI SDK types): K2.6 thinks
            // before answering by default, which delays the first token by
            // seconds. Grounded persona Q&A doesn't need it — disable.
            // Note: temperature must stay unset on this model either way.
            ...({ thinking: { type: "disabled" } } as Record<string, unknown>),
          });

          let assistantText = "";
          const toolCalls: AccumulatedToolCall[] = [];
          let finishReason: string | null = null;

          for await (const chunk of completion) {
            const choice = chunk.choices[0];
            if (!choice) continue;

            if (choice.delta?.content) {
              assistantText += choice.delta.content;
              send({ type: "text", text: choice.delta.content });
            }

            // Tool-call arguments stream incrementally, keyed by index.
            for (const deltaCall of choice.delta?.tool_calls ?? []) {
              const index = deltaCall.index ?? 0;
              toolCalls[index] ??= { id: "", name: "", argumentsJson: "" };
              if (deltaCall.id) toolCalls[index].id = deltaCall.id;
              if (deltaCall.function?.name) toolCalls[index].name = deltaCall.function.name;
              if (deltaCall.function?.arguments) {
                toolCalls[index].argumentsJson += deltaCall.function.arguments;
              }
            }

            if (choice.finish_reason) finishReason = choice.finish_reason;
          }

          if (finishReason !== "tool_calls" || toolCalls.length === 0) break;

          for (const call of toolCalls) {
            let input: Record<string, unknown> = {};
            try {
              input = JSON.parse(call.argumentsJson || "{}");
            } catch {
              // Malformed arguments — still ack the call so the loop can continue.
            }
            send({ type: "tool", name: call.name, input });
          }

          // One-shot replies: if the model already said a sentence before the
          // tool call, that's the whole answer — skip the follow-up completion
          // that would extend the bubble seconds later. Only continue when the
          // tool fired with no text at all (never leave a silent scroll).
          if (assistantText.trim()) break;

          history.push({
            role: "assistant",
            content: assistantText || null,
            tool_calls: toolCalls.map((call) => ({
              id: call.id,
              type: "function" as const,
              function: { name: call.name, arguments: call.argumentsJson || "{}" },
            })),
          });
          for (const call of toolCalls) {
            history.push({
              role: "tool",
              tool_call_id: call.id,
              content: "Done — the visitor's browser has performed this action.",
            });
          }
        }

        send({ type: "done" });
      } catch (error) {
        if (error instanceof OpenAI.RateLimitError || error instanceof OpenAI.APIConnectionError) {
          send({ type: "error", message: "busy" });
        } else {
          console.error("chat route error", error);
          send({ type: "error", message: "unavailable" });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
