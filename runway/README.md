# Runway Characters — portal setup for the video twin

Everything in this folder is generated from [`src/lib/knowledge/satvik.ts`](../src/lib/knowledge/satvik.ts) by `pnpm export:runway` (except `reference-image.jpg`). **After editing the knowledge base, re-run the export and re-upload here — keep the text twin and the video twin telling the same story.**

| File | Where it goes in the portal |
|---|---|
| `reference-image.jpg` | Character appearance (1088×704, as Runway recommends) |
| `character-know.txt` | Creation wizard's single **"What should your character know?"** field (persona + compact facts in one paste) |
| `personality.txt` | Personality / system prompt field — use instead of `character-know.txt` **only** when the portal also has a separate Knowledge Base document upload |
| `knowledge-base.md` | Knowledge Base → upload as document (when that section exists) |
| `start-script.txt` | **"What should your character say when the conversation starts?"** field (limit 2,000 chars) |

## One-time setup at [dev.runwayml.com](https://dev.runwayml.com/)

1. **Create the Character** — upload `reference-image.jpg` as the appearance reference.
2. **Voice** — clone Satvik's voice from a clean audio sample:
   - Record 1–2 minutes of yourself speaking naturally (vary the sentences: introduce yourself, talk about a project, ask a question, laugh once).
   - Quiet room, no music, phone mic held ~20cm away works fine.
   - Fallback: pick a preset or design a voice from a text prompt.
3. **Personality** — paste the contents of `personality.txt`.
4. **Knowledge Base** — upload `knowledge-base.md` as a document.
5. **Start script** — paste the contents of `start-script.txt`.
6. **Rehearse** — run 5–10 test conversations in the portal. Ask the questions a recruiter would ask (experience, availability, visa, projects). Tweak `RUNWAY_PERSONA` in `satvik.ts` + re-export if the tone feels off.

## Embed tab (cost + security controls)

| Setting | Value |
|---|---|
| Allowed Origins | `https://satviksabharwal.com`, `https://www.satviksabharwal.com`, `https://localhost:3000` (Runway accepts https only — use `pnpm dev:https` locally) |
| Max session duration | 180 s (platform hard cap is 300 s) |
| Max daily calls | Start at 30–50 — sessions cost ~$0.20/min, so this caps worst-case spend |
| Colors | Background `#05070f`, accent `#00f5c4` (site tokens) |
| Layout | Compact, circle video, **placement bottom LEFT**, **auto-expand OFF** |

> The widget script loads globally in the locale layout, so Runway renders its own floating button on every page. Placement must be bottom **left** (our chat launcher owns bottom right) and auto-expand must be **OFF** (otherwise a call UI would open on every page load).

## Connect it to the site

1. Copy the `pub_...` key from the Embed tab.
2. Add to `.env.local` **and** Vercel env settings:
   ```env
   NEXT_PUBLIC_RUNWAY_PUB_KEY=pub_...
   ```
3. Restart the dev server (`pnpm dev:https` for local video testing). Runway's floating button appears bottom-left on every page (the script is skipped entirely while the env var is unset).

## Verify

- On `localhost`: open chat → click the video button → Runway UI opens → grant mic → the avatar greets you with the start script.
- Ask the same questions you asked the text twin — answers should match (same knowledge base).
- Let a session hit the 180s cap once to confirm it ends gracefully.
- Check no second floating button exists before clicking the video CTA.
