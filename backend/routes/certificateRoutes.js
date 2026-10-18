/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Backend Routes: CertificateRoutes
 */
import { Router } from "express";
import { CertificatesController } from '../controllers/certificatesController.js';
import { requireAuth } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/", CertificatesController.getAll);
router.get("/categories", CertificatesController.getCategories);
router.get("/:id", CertificatesController.getById);
router.post("/", requireAuth, CertificatesController.create);
router.put("/:id", requireAuth, CertificatesController.update);
router.delete("/:id", requireAuth, CertificatesController.delete);
var stdin_default = router;
export {
  stdin_default as default
};
