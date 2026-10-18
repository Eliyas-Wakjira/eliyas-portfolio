/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: SkillRoutes
 */
import { Router } from "express";
import { SkillsController } from '../controllers/skillsController.js';
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/", SkillsController.getAll);
router.post("/", requireAuth, SkillsController.create);
router.put("/:id", requireAuth, SkillsController.update);
router.delete("/:id", requireAuth, SkillsController.delete);
var stdin_default = router;
export {
  stdin_default as default
};
