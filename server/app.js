import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import financeRoutes from "./routes/finance.js";
import metricsRoutes from "./routes/metrics.js";

function corsOrigin(origin, callback) {
  if (!origin || config.appOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS origin is not allowed: ${origin}`));
}

export function createApp() {
  const app = express();

  app.use(cors({
    origin: corsOrigin,
    credentials: true,
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser(config.sessionSecret));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "finance-backend",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/finance", financeRoutes);
  app.use("/api/metrics", metricsRoutes);

  app.use((req, res) => {
    res.status(404).json({
      error: "not_found",
      message: `Route ${req.method} ${req.originalUrl} was not found.`,
    });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    const status = Number(error.status) || 500;
    res.status(status).json({
      error: error.code || (status >= 500 ? "internal_error" : "request_error"),
      message: error.message || "Unexpected server error.",
    });
  });

  return app;
}
