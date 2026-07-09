import crypto from "crypto";
import { config } from "../config.js";
import { query } from "../db.js";
import { readStore, updateStore } from "../storage/file-store.js";

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

  if (config.dataBackend === "file") {
    await updateStore((current) => {
      current.sessions.push({
        id: current.nextIds.sessions,
        user_id: Number(userId),
        token_hash: tokenHash,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        last_used_at: new Date().toISOString(),
      });
      current.nextIds.sessions += 1;
      return current;
    });

    return { token, expiresAt };
  }

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

  if (config.dataBackend === "file") {
    const store = await readStore();
    const session = store.sessions.find((item) => item.token_hash === tokenHash && new Date(item.expires_at).getTime() > Date.now());
    if (!session) return null;

    const user = store.users.find((item) => Number(item.id) === Number(session.user_id));
    if (!user) return null;

    await updateStore((current) => {
      const target = current.sessions.find((item) => item.token_hash === tokenHash);
      if (target) target.last_used_at = new Date().toISOString();
      return current;
    });

    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      session_id: session.id,
      expires_at: session.expires_at,
    };
  }

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

  if (config.dataBackend === "file") {
    await updateStore((current) => {
      current.sessions = current.sessions.filter((item) => item.token_hash !== tokenHash);
      return current;
    });
    return;
  }

  await query("delete from user_sessions where token_hash = $1", [tokenHash]);
}

export async function deleteExpiredSessions() {
  if (config.dataBackend === "file") {
    await updateStore((current) => {
      const now = Date.now();
      current.sessions = current.sessions.filter((item) => new Date(item.expires_at).getTime() > now);
      return current;
    });
    return;
  }

  await query("delete from user_sessions where expires_at <= now()");
}
