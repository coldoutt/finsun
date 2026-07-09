import { clearSessionCookie, getSessionUserByToken, readSessionToken } from "../auth/session.js";
import { asyncHandler } from "../lib/async-handler.js";

export const requireAuth = asyncHandler(async function requireAuth(req, res, next) {
  const token = readSessionToken(req);
  const user = await getSessionUserByToken(token);

  if (!user) {
    clearSessionCookie(res);
    return res.status(401).json({
      error: "unauthorized",
      message: "Требуется вход в систему.",
    });
  }

  req.user = user;
  return next();
});
