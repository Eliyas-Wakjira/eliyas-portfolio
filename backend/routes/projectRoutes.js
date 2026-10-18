/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: ProjectRoutes
 */
import { Router } from "express";
import { ProjectsController } from '../controllers/projectsController.js';
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/", ProjectsController.getAll);
router.get("/:id", ProjectsController.getById);
router.post("/", requireAuth, ProjectsController.create);
router.put("/:id", requireAuth, ProjectsController.update);
router.delete("/:id", requireAuth, ProjectsController.delete);
var stdin_default = router;
export {
  stdin_default as default
};
