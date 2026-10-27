/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Full-Stack Server Entry Point
 * Runs Express backend with Vite middleware in development
 */
import express from "express";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createBackendApp, createHttpServer } from "./server.js";
import { errorHandler } from './middleware/errorHandler.js';
import { db } from "./config/db.js";
import { DEFAULT_PROFILE } from "./models/profileModel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");
async function startServer() {
  await db.initialize(DEFAULT_PROFILE);
  const app = createBackendApp();
  const PORT = process.env.PORT || 3e3;
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.resolve(__dirname, "frontend"),
      configFile: path.resolve(__dirname, "vite.config.js"),
      server: { middlewareMode: true, port: 3e3, host: "0.0.0.0" },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist"), { dotfiles: "deny", index: false }));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.use(errorHandler);
  createHttpServer(app).listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[Full-Stack MVC] Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch(async (error) => {
  console.error("[Full-Stack MVC] Failed to initialize MySQL:", error);
  try {
    await db.close();
  } catch (closeError) {
    console.error("[Full-Stack MVC] Failed to close MySQL pool:", closeError);
  }
  process.exitCode = 1;
});
