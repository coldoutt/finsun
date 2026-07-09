import crypto from "crypto";
import { config } from "../config.js";
import { query } from "../db.js";

function hashToken(token) {
  return crypto
    .createHmac("sha256", config.sessionSecret)
    .update(token)
    .digest("hex");
}

function sessionExpiryDate() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.sessionTtlDays);
  return expiresAt;
}

export function readSessionToken(req) {
  return req.signedCookies?.[config.sessionCookieName] || null;
}

export function setSessionCookie(res, token) {
  res.cookie(config.sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.cookieSecure,
    signed: true,
    path: "/",
    maxAge: config.sessionTtlDays * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(config.sessionCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.cookieSecure,
    signed: true,
    path: "/",
  });
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = sessionExpiryDate();

  await query(
    `insert into user_sessions (user_id, token_hash, expires_at)
     values ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  return { token, expiresAt };
}

export async function getSessionUserByToken(token) {
  if (!token) return null;

  const tokenHash = hashToken(token);
  const result = await query(
    `select
       u.id,
       u.email,
       u.created_at,
       s.id as session_id,
       s.expires_at
     from user_sessions s
     join users u on u.id = s.user_id
     where s.token_hash = $1
       and s.expires_at > now()
     limit 1`,
    [tokenHash]
  );

  if (!result.rows.length) return null;

  await query(
    `update user_sessions
     set last_used_at = now()
     where token_hash = $1`,
    [tokenHash]
  );

  return result.rows[0];
}

export async function deleteSessionByToken(token) {
  if (!token) return;
  const tokenHash = hashToken(token);
  await query("delete from user_sessions where token_hash = $1", [tokenHash]);
}

export async function deleteExpiredSessions() {
  await query("delete from user_sessions where expires_at <= now()");
}
