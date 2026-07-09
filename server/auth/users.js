import crypto from "crypto";
import { promisify } from "util";
import { config } from "../config.js";
import { query } from "../db.js";
import { readStore, updateStore } from "../storage/file-store.js";

const scrypt = promisify(crypto.scrypt);

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
  if (config.dataBackend === "file") {
    const store = await readStore();
    return store.users.find((user) => user.email === normalizeEmail(email)) || null;
  }

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
  const passwordHash = await hashPassword(password);

  if (config.dataBackend === "file") {
    const store = await updateStore((current) => {
      const user = {
        id: current.nextIds.users,
        email: normalizeEmail(email),
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
      };
      current.nextIds.users += 1;
      current.users.push(user);
      return current;
    });

    return store.users.at(-1);
  }

  const result = await query(
    `insert into users (email, password_hash)
     values ($1, $2)
     returning id, email, created_at`,
    [normalizeEmail(email), passwordHash]
  );

  return result.rows[0];
}

export async function verifyPassword(user, password) {
  return verifyPasswordHash(String(password || ""), user.password_hash);
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const cost = Math.max(1, config.bcryptRounds);
  const derivedKey = await scrypt(String(password || ""), salt, 64, { N: 2 ** Math.min(cost, 15) });
  return `scrypt$${cost}$${salt}$${Buffer.from(derivedKey).toString("hex")}`;
}

async function verifyPasswordHash(password, storedHash) {
  if (!storedHash || !storedHash.startsWith("scrypt$")) return false;

  const [, costRaw, salt, expectedHex] = storedHash.split("$");
  const cost = Number(costRaw) || config.bcryptRounds;
  const derivedKey = await scrypt(String(password || ""), salt, 64, { N: 2 ** Math.min(cost, 15) });
  const actual = Buffer.from(derivedKey).toString("hex");

  const expectedBuffer = Buffer.from(expectedHex, "hex");
  const actualBuffer = Buffer.from(actual, "hex");
  if (expectedBuffer.length !== actualBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
