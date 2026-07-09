import { config } from "../config.js";

const attempts = new Map();

function cleanupExpired(now) {
  for (const [key, entry] of attempts.entries()) {
    if (entry.resetAt <= now) {
      attempts.delete(key);
    }
  }
}

function getAttemptKey(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwardedFor || req.ip || req.socket?.remoteAddress || "unknown";
  const email = String(req.body?.email || "").trim().toLowerCase();
  return `${ip}:${email}`;
}

export function authRateLimit(req, res, next) {
  const now = Date.now();
  cleanupExpired(now);

  const key = getAttemptKey(req);
  const existing = attempts.get(key);
  if (!existing) {
    req.authRateLimitKey = key;
    return next();
  }

  if (existing.count >= config.authRateLimitMaxAttempts && existing.resetAt > now) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      error: "rate_limited",
      message: "Слишком много попыток входа. Попробуйте позже.",
    });
  }

  req.authRateLimitKey = key;
  return next();
}

export function recordAuthFailure(key) {
  const now = Date.now();
  const existing = attempts.get(key);
  if (!existing || existing.resetAt <= now) {
    attempts.set(key, {
      count: 1,
      resetAt: now + config.authRateLimitWindowMs,
    });
    return;
  }

  existing.count += 1;
  attempts.set(key, existing);
}

export function clearAuthFailures(key) {
  if (!key) return;
  attempts.delete(key);
}
