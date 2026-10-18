/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Server Factory (MVC Architecture)
 */
import express from "express";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiRouter from './routes/index.js';
import { errorHandler } from "./middleware/errorHandler.js";
import { db } from "./config/db.js";
import { DEFAULT_PROFILE } from "./models/profileModel.js";

function createBackendApp() {
  const app = express();
  const allowedOrigins = new Set(
    (process.env.FRONTEND_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  );

  app.disable("x-powered-by");
  app.use("/api", (req, res, next) => {
    const origin = req.get("origin");
    if (origin) {
      res.vary("Origin");
      const requestOrigin = `${req.protocol}://${req.get("host")}`;
      if (!allowedOrigins.has(origin) && origin !== requestOrigin) {
        return res.status(403).json({ error: { message: "Origin not allowed" } });
      }
      res.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true"
      });
    }
    if (req.method === "OPTIONS") {
      res.set({
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      });
      return res.sendStatus(204);
    }
    next();
  });
  app.use((_req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
    });
    if (process.env.NODE_ENV === "production") {
      res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });
  app.use(express.json({ limit: "32kb" }));
  app.use(express.urlencoded({ extended: false, limit: "32kb" }));
  app.use(
    "/frontend/assets/uploads",
    express.static(path.resolve(process.cwd(), "public", "frontend", "assets", "uploads"), {
      dotfiles: "deny",
      fallthrough: true,
      index: false
    })
  );
  app.use("/api", apiRouter);
  return app;
}
export {
  createBackendApp
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  db.initialize(DEFAULT_PROFILE)
    .then(() => {
      const app = createBackendApp();
      app.use(errorHandler);

      const port = Number(process.env.PORT || 3000);
      app.listen(port, "0.0.0.0", () => {
        console.log(`[Portfolio API] Server running on http://0.0.0.0:${port}`);
      });
    })
    .catch((error) => {
      console.error("[Portfolio API] Failed to initialize MySQL:", error);
      process.exitCode = 1;
    });
}
