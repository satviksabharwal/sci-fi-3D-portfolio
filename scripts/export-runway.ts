/**
 * Generates the upload-ready Runway Characters assets from the single
 * source of truth in src/lib/knowledge/satvik.ts.
 *
 * Run: pnpm export:runway
 * Then upload the files from runway/ in the portal (dev.runwayml.com).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  KNOWLEDGE_BASE,
  RUNWAY_KNOWLEDGE_COMPACT,
  RUNWAY_PERSONA,
  RUNWAY_START_SCRIPT,
} from "../src/lib/knowledge/satvik";

const OUT_DIR = join(__dirname, "..", "runway");
const PERSONALITY_LIMIT = 10_000;
const START_SCRIPT_LIMIT = 2_000;

mkdirSync(OUT_DIR, { recursive: true });

const files: Array<{ name: string; content: string; limit?: number }> = [
  { name: "knowledge-base.md", content: KNOWLEDGE_BASE },
  { name: "personality.txt", content: RUNWAY_PERSONA, limit: PERSONALITY_LIMIT },
  { name: "start-script.txt", content: RUNWAY_START_SCRIPT, limit: START_SCRIPT_LIMIT },
  {
    name: "character-know.txt",
    content: `${RUNWAY_PERSONA}\n\n${RUNWAY_KNOWLEDGE_COMPACT}`,
    limit: PERSONALITY_LIMIT,
  },
];

for (const file of files) {
  writeFileSync(join(OUT_DIR, file.name), file.content);
  const status = file.limit
    ? file.content.length <= file.limit
      ? `OK (${file.content.length}/${file.limit} chars)`
      : `TOO LONG (${file.content.length}/${file.limit} chars) — trim before uploading!`
    : `${file.content.length} chars`;
  console.log(`runway/${file.name} — ${status}`);
}
