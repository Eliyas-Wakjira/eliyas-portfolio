/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: ExperienceRoutes
 */
import { Router } from "express";
import { ExperiencesController } from '../controllers/experiencesController.js';
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/", ExperiencesController.getAll);
router.post("/", requireAuth, ExperiencesController.create);
router.put("/:id", requireAuth, ExperiencesController.update);
router.delete("/:id", requireAuth, ExperiencesController.delete);
var stdin_default = router;
export {
  stdin_default as default
};
