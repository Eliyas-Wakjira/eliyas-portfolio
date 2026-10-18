/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: MessageRoutes
 */
import { Router } from "express";
import { MessagesController } from '../controllers/messagesController.js';
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.post("/", MessagesController.submit);
router.get("/", requireAuth, MessagesController.getAll);
router.delete("/:id", requireAuth, MessagesController.delete);
var stdin_default = router;
export {
  stdin_default as default
};
