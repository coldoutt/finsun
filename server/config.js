import dotenv from "dotenv";
import path from "path";

dotenv.config();

function readBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

function readOrigins(value) {
  return String(value || "http://localhost:5500,http://127.0.0.1:5500")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT || 3000),
  appOrigins: readOrigins(process.env.APP_ORIGIN),
  dataBackend: String(process.env.DATA_BACKEND || "postgres").trim().toLowerCase(),
  dataFile: path.resolve(process.cwd(), process.env.DATA_FILE || "server/data/app-data.json"),
  databaseUrl: process.env.DATABASE_URL || "",
  sessionSecret: process.env.SESSION_SECRET || "change-me",
  cookieSecure: readBoolean(process.env.COOKIE_SECURE, false),
  sessionCookieName: process.env.SESSION_COOKIE_NAME || "finance_session",
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS || 30),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  metricsCacheMs: Number(process.env.METRICS_CACHE_MS || 60 * 60 * 1000),
  authRateLimitWindowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  authRateLimitMaxAttempts: Number(process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS || 10),
};
