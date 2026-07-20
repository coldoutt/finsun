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
  const defaults = getDefaultProfile(user.email);
  const firstName = String(user.first_name || user.firstName || defaults.firstName);
  const lastName = String(user.last_name || user.lastName || defaults.lastName);
  const hasLegacyOwnerProfile = normalizeEmail(user.email) === "tonygazz@gmail.com"
    && firstName === "Tony"
    && lastName === "Gazz";
  return {
    id: Number(user.id),
    email: user.email,
    firstName: hasLegacyOwnerProfile ? defaults.firstName : firstName,
    lastName: hasLegacyOwnerProfile ? defaults.lastName : lastName,
    createdAt: user.created_at,
  };
}

export function getDefaultProfile(email) {
  const normalizedEmail = normalizeEmail(email);
  if (normalizedEmail === "tonygazz@gmail.com") {
    return { firstName: "Антон", lastName: "Гасилин" };
  }

  const parts = normalizedEmail
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return {
    firstName: parts[0] || "Пользователь",
    lastName: parts.slice(1).join(" "),
  };
}

export function validateProfile(firstName, lastName) {
  const normalizedFirstName = String(firstName || "").trim();
  const normalizedLastName = String(lastName || "").trim();
  if (!normalizedFirstName || !normalizedLastName || normalizedFirstName.length > 80 || normalizedLastName.length > 80) {
    return { ok: false, message: "Укажите имя и фамилию длиной до 80 символов." };
  }
  return { ok: true, firstName: normalizedFirstName, lastName: normalizedLastName };
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
    `select id, email, password_hash, first_name, last_name, created_at
     from users
     where email = $1
     limit 1`,
    [normalizeEmail(email)]
  );

  return result.rows[0] || null;
}

export async function createUser(email, password, inputProfile = null) {
  const passwordHash = await hashPassword(password);
  const profile = inputProfile || getDefaultProfile(email);

  if (config.dataBackend === "file") {
    const store = await updateStore((current) => {
      const user = {
        id: current.nextIds.users,
        email: normalizeEmail(email),
        password_hash: passwordHash,
        first_name: profile.firstName,
        last_name: profile.lastName,
        created_at: new Date().toISOString(),
      };
      current.nextIds.users += 1;
      current.users.push(user);
      return current;
    });

    return store.users.at(-1);
  }

  const result = await query(
    `insert into users (email, password_hash, first_name, last_name)
     values ($1, $2, $3, $4)
     returning id, email, first_name, last_name, created_at`,
    [normalizeEmail(email), passwordHash, profile.firstName, profile.lastName]
  );

  return result.rows[0];
}

export async function updateUserProfile(userId, firstName, lastName) {
  if (config.dataBackend === "file") {
    const store = await updateStore((current) => {
      const user = current.users.find((item) => Number(item.id) === Number(userId));
      if (!user) return current;
      user.first_name = firstName;
      user.last_name = lastName;
      return current;
    });
    return store.users.find((item) => Number(item.id) === Number(userId)) || null;
  }

  const result = await query(
    `update users
     set first_name = $2, last_name = $3
     where id = $1
     returning id, email, first_name, last_name, created_at`,
    [userId, firstName, lastName]
  );
  return result.rows[0] || null;
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
