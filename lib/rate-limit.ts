const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // max 10 subscribe attempts per IP per minute

type RateLimitEntry = { count: number; resetAt: number };
const rateLimitMap = new Map<string, RateLimitEntry>();

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp ?? 'unknown';
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

/** Clear all rate limit entries. Exported for test isolation. */
export function resetRateLimit(): void {
  rateLimitMap.clear();
}

// Periodic cleanup to prevent memory leaks in long-lived instances
if (typeof globalThis !== 'undefined') {
  const CLEANUP_INTERVAL_MS = 5 * 60_000; // every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now >= entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS).unref?.();
}
