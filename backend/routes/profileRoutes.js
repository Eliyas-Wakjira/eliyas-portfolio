/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: ProfileRoutes
 */
import { Router } from "express";
import { ProfileController } from '../controllers/profileController.js';
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", ProfileController.get);
router.put("/", requireAuth, ProfileController.update);
router.post("/reset", requireAuth, ProfileController.reset);

export default router;
