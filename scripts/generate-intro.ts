/**
 * Renders the hero intro as avatar videos of Satvik speaking each line, using
 * Runway's pre-rendered avatar video API (the same Character as the live video
 * twin, so it has his face and cloned voice). The clips play inside the
 * astronaut's helmet when the visor opens.
 *
 * Needs in .env.local (server-side secrets — never NEXT_PUBLIC_):
 *   RUNWAYML_API_SECRET=key_...      API key from dev.runwayml.com
 *   RUNWAY_AVATAR_ID=<uuid>          optional if the account has exactly one avatar
 *
 * Run:  pnpm generate:intro            render missing clips (spends Runway credits)
 *       pnpm generate:intro --dry      show what would be rendered, spend nothing
 *       pnpm generate:intro --force    re-render clips that already exist
 *       pnpm generate:intro --only=en/line-1   render just that clip
 *
 * Output: public/intro/<locale>/line-N.mp4 + again.mp4, and the manifest
 * src/lib/intro-clips.json that tells the hero which clips exist.
 * Re-run after changing hero.intro in messages/*.json.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const API = "https://api.dev.runwayml.com";
const API_VERSION = "2024-11-06";
const LOCALES = ["en", "de"];
const DRY = process.argv.includes("--dry");
const FORCE = process.argv.includes("--force");
// --only=en/line-1 renders a single clip (handy for checking quality first).
const ONLY = process.argv.find((arg) => arg.startsWith("--only="))?.slice(7);

// Minimal .env.local reader so the script has no dependencies.
function loadEnv() {
  const file = join(ROOT, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

type Clip = { locale: string; key: string; text: string; file: string };

function plan(): Clip[] {
  const clips: Clip[] = [];
  for (const locale of LOCALES) {
    const messages = JSON.parse(
      readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"),
    );
    const intro = messages.hero.intro as { lines: string[]; again: string };
    const add = (key: string, text: string) =>
      clips.push({
        locale,
        key,
        text,
        file: join(ROOT, "public", "intro", locale, `${key}.mp4`),
      });
    intro.lines.forEach((text, i) => add(`line-${i + 1}`, text));
    add("again", intro.again);
  }
  return clips;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.RUNWAYML_API_SECRET}`,
      "X-Runway-Version": API_VERSION,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} → ${response.status} ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}

async function resolveAvatarId(): Promise<string> {
  if (process.env.RUNWAY_AVATAR_ID) return process.env.RUNWAY_AVATAR_ID;
  const { data } = await api<{ data: { id: string; name: string; status: string }[] }>(
    "/v1/avatars",
  );
  const ready = data.filter((a) => a.status === "READY");
  if (ready.length === 1) return ready[0].id;
  console.error(
    ready.length === 0
      ? "No READY avatar on this Runway account. Create the Character first (see runway/README.md)."
      : "Several avatars found — set RUNWAY_AVATAR_ID in .env.local to one of:",
  );
  ready.forEach((a) => console.error(`  ${a.id}  ${a.name}`));
  process.exit(1);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function render(clip: Clip, avatarId: string) {
  const { id } = await api<{ id: string }>("/v1/avatar_videos", {
    method: "POST",
    body: JSON.stringify({
      model: "gwm1_avatars",
      avatar: { type: "custom", avatarId },
      // No `voice`: Runway then uses the avatar's own configured (cloned) voice.
      speech: { type: "text", text: clip.text },
    }),
  });
  for (;;) {
    await sleep(6000); // the API asks for polls no more often than every 5s
    const task = await api<{ status: string; output?: string[]; failure?: string }>(
      `/v1/tasks/${id}`,
    );
    if (task.status === "SUCCEEDED" && task.output?.[0]) {
      const video = await fetch(task.output[0]);
      if (!video.ok) throw new Error(`download failed: ${video.status}`);
      mkdirSync(join(clip.file, ".."), { recursive: true });
      writeFileSync(clip.file, Buffer.from(await video.arrayBuffer()));
      return;
    }
    if (task.status === "FAILED" || task.status === "CANCELLED") {
      throw new Error(`task ${id} ${task.status}: ${task.failure ?? "no reason given"}`);
    }
  }
}

function writeManifest(clips: Clip[]) {
  const manifest: Record<string, string[]> = {};
  for (const locale of LOCALES) {
    manifest[locale] = clips
      .filter((c) => c.locale === locale && existsSync(c.file))
      .map((c) => c.key);
  }
  writeFileSync(
    join(ROOT, "src", "lib", "intro-clips.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log("manifest:", JSON.stringify(manifest));
}

async function main() {
  loadEnv();
  const clips = plan();
  const todo = clips.filter(
    (c) => (FORCE || !existsSync(c.file)) && (!ONLY || ONLY === `${c.locale}/${c.key}`),
  );
  const chars = todo.reduce((n, c) => n + c.text.length, 0);
  console.log(`${todo.length} of ${clips.length} clips to render, ${chars} characters of script.`);
  todo.forEach((c) => console.log(`  ${c.locale}/${c.key}: ${c.text}`));

  if (DRY) {
    writeManifest(clips);
    return;
  }
  if (!process.env.RUNWAYML_API_SECRET) {
    console.error("RUNWAYML_API_SECRET is not set in .env.local — nothing rendered.");
    process.exit(1);
  }
  const avatarId = await resolveAvatarId();
  for (const clip of todo) {
    process.stdout.write(`rendering ${clip.locale}/${clip.key} … `);
    await render(clip, avatarId);
    console.log("done");
    writeManifest(clips); // keep the manifest valid even if a later clip fails
  }
  writeManifest(clips);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
