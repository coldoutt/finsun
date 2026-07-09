import express from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { getCachedMetrics } from "../metrics/cbr.js";

const router = express.Router();

router.get("/", asyncHandler(async (_req, res) => {
  const metrics = await getCachedMetrics();
  res.json({
    metrics,
  });
}));

export default router;
