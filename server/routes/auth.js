import express from "express";
import {
  clearSessionCookie,
  createSession,
  deleteExpiredSessions,
  deleteSessionByToken,
  getSessionUserByToken,
  readSessionToken,
  setSessionCookie,
} from "../auth/session.js";
import {
  createUser,
  findUserByEmail,
  sanitizeUser,
  validateCredentials,
  verifyPassword,
} from "../auth/users.js";
import { asyncHandler } from "../lib/async-handler.js";
import { authRateLimit, clearAuthFailures, recordAuthFailure } from "../middleware/auth-rate-limit.js";

const router = express.Router();

router.post("/register", authRateLimit, asyncHandler(async (req, res) => {
  await deleteExpiredSessions();

  const validation = validateCredentials(req.body?.email, req.body?.password);
  if (!validation.ok) {
    recordAuthFailure(req.authRateLimitKey);
    return res.status(400).json({
      error: "invalid_input",
      message: validation.message,
    });
  }

  const existingUser = await findUserByEmail(validation.email);
  if (existingUser) {
    recordAuthFailure(req.authRateLimitKey);
    return res.status(409).json({
      error: "email_taken",
      message: "Пользователь с таким email уже существует.",
    });
  }

  const user = await createUser(validation.email, validation.password);
  const session = await createSession(user.id);
  clearAuthFailures(req.authRateLimitKey);
  setSessionCookie(res, session.token);

  return res.status(201).json({
    user: sanitizeUser(user),
  });
}));

router.post("/login", authRateLimit, asyncHandler(async (req, res) => {
  await deleteExpiredSessions();

  const email = req.body?.email;
  const password = req.body?.password;
  if (!email || !password) {
    recordAuthFailure(req.authRateLimitKey);
    return res.status(400).json({
      error: "invalid_input",
      message: "Укажите email и пароль.",
    });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    recordAuthFailure(req.authRateLimitKey);
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Неверный email или пароль.",
    });
  }

  const passwordOk = await verifyPassword(user, password);
  if (!passwordOk) {
    recordAuthFailure(req.authRateLimitKey);
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Неверный email или пароль.",
    });
  }

  const session = await createSession(user.id);
  clearAuthFailures(req.authRateLimitKey);
  setSessionCookie(res, session.token);

  return res.json({
    user: sanitizeUser(user),
  });
}));

router.post("/logout", asyncHandler(async (req, res) => {
  const token = readSessionToken(req);
  if (token) {
    await deleteSessionByToken(token);
  }

  clearSessionCookie(res);

  return res.status(204).send();
}));

router.get("/me", asyncHandler(async (req, res) => {
  const token = readSessionToken(req);
  const user = await getSessionUserByToken(token);

  if (!user) {
    clearSessionCookie(res);
    return res.status(401).json({
      error: "unauthorized",
      message: "Сессия не найдена или истекла.",
    });
  }

  return res.json({
    user: sanitizeUser(user),
  });
}));

export default router;
