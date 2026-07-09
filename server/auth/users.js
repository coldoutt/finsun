import bcrypt from "bcrypt";
import { config } from "../config.js";
import { query } from "../db.js";

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function sanitizeUser(user) {
  return {
    id: Number(user.id),
    email: user.email,
    createdAt: user.created_at,
  };
}

export function validateCredentials(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || "");

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { ok: false, message: "Укажите корректный email." };
  }

  if (normalizedPassword.length < 8) {
    return { ok: false, message: "Пароль должен содержать минимум 8 символов." };
  }

  return {
    ok: true,
    email: normalizedEmail,
    password: normalizedPassword,
  };
}

export async function findUserByEmail(email) {
  const result = await query(
    `select id, email, password_hash, created_at
     from users
     where email = $1
     limit 1`,
    [normalizeEmail(email)]
  );

  return result.rows[0] || null;
}

export async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  const result = await query(
    `insert into users (email, password_hash)
     values ($1, $2)
     returning id, email, created_at`,
    [normalizeEmail(email), passwordHash]
  );

  return result.rows[0];
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(String(password || ""), user.password_hash);
}
