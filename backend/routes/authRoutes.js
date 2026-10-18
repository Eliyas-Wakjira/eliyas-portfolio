/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: AuthRoutes
 */
import { Router } from "express";
import { AuthController } from '../controllers/authController.js';
import { requireAuth } from "../middleware/authMiddleware.js";
import { loginRateLimit } from "../middleware/loginRateLimit.js";
const router = Router();
router.post("/login", loginRateLimit, AuthController.login);
router.get("/me", requireAuth, AuthController.getMe);
router.post("/logout", AuthController.logout);
var stdin_default = router;
export {
  stdin_default as default
};
