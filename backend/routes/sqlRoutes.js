/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: SqlRoutes
 */
import { Router } from "express";
import { SqlController } from '../controllers/sqlController.js';
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.post("/execute", requireAuth, SqlController.execute);
var stdin_default = router;
export {
  stdin_default as default
};
