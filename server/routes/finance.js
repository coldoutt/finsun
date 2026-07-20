import express from "express";
import {
  hasFinanceState,
  loadFinanceState,
  saveFinanceState,
  validateFinanceState,
} from "../finance/state.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/state", asyncHandler(async (req, res) => {
  const [state, initialized] = await Promise.all([
    loadFinanceState(req.user.id),
    hasFinanceState(req.user.id),
  ]);
  res.json({
    state,
    initialized,
  });
}));

router.put("/state", asyncHandler(async (req, res) => {
  const validation = validateFinanceState(req.body?.state);
  if (!validation.ok) {
    return res.status(400).json({
      error: "invalid_state",
      message: validation.message,
    });
  }

  const state = await saveFinanceState(req.user.id, validation.state);
  return res.json({
    state,
  });
}));

export default router;
