const WINDOW_MS = 60_000;

const requestsByIp = new Map<string, number[]>();

let globalDaily = { day: "", count: 0 };

function maxPerMinute(): number {
  const parsed = Number(process.env.CHAT_MAX_REQUESTS_PER_MINUTE);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

function globalDailyLimit(): number {
  const parsed = Number(process.env.CHAT_GLOBAL_DAILY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 500;
}

export type RateLimitResult = { allowed: true } | { allowed: false; reason: "ip" | "global" };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  // Global daily budget — the cost kill switch.
  const today = new Date().toISOString().slice(0, 10);
  if (globalDaily.day !== today) {
    globalDaily = { day: today, count: 0 };
  }
  if (globalDaily.count >= globalDailyLimit()) {
    return { allowed: false, reason: "global" };
  }

  // Per-IP sliding window.
  const windowStart = now - WINDOW_MS;
  const timestamps = (requestsByIp.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= maxPerMinute()) {
    requestsByIp.set(ip, timestamps);
    return { allowed: false, reason: "ip" };
  }

  timestamps.push(now);
  requestsByIp.set(ip, timestamps);
  globalDaily.count += 1;

  // Keep the map from growing unbounded across many unique IPs.
  if (requestsByIp.size > 5_000) {
    requestsByIp.forEach((stamps, key) => {
      if (stamps.every((t) => t <= windowStart)) requestsByIp.delete(key);
    });
  }

  return { allowed: true };
}
