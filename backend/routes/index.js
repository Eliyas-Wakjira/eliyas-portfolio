/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Central Router (MVC Architecture)
 * Mounts all sub-routers: projects, certificates, skills, experiences, messages, auth, and sql.
 */
import { Router } from "express";
import projectRoutes from './projectRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import skillRoutes from './skillRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import messageRoutes from './messageRoutes.js';
import authRoutes from './authRoutes.js';
import sqlRoutes from './sqlRoutes.js';
import profileRoutes from './profileRoutes.js';
import uploadRoutes from "./uploadRoutes.js";
const apiRouter = Router();
apiRouter.use("/profile", profileRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/certificates", certificateRoutes);
apiRouter.use("/skills", skillRoutes);
apiRouter.use("/experiences", experienceRoutes);
apiRouter.use("/messages", messageRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/sql", sqlRoutes);
apiRouter.use("/uploads", uploadRoutes);
apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "online",
    architecture: "MVC Full-Stack",
    service: "Eliyas Wakjira Portfolio Backend API",
    version: "1.0.0",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
var stdin_default = apiRouter;
export {
  stdin_default as default
};
