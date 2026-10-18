import { Router } from "express";
import express from "express";
import { UploadController } from "../controllers/uploadController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
const imageBody = (req, res, next) => {
  if (!["image/jpeg", "image/png", "image/webp"].includes(req.get("content-type"))) {
    return res.status(415).json({
      success: false,
      error: { message: "Only JPEG, PNG, or WebP images are accepted", statusCode: 415 }
    });
  }
  return express.raw({ type: "image/*", limit: "5mb" })(req, res, next);
};
const certificateFileBody = (req, res, next) => {
  const contentType = req.get("content-type");
  if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(contentType)) {
    return res.status(415).json({
      success: false,
      error: { message: "Only JPEG, PNG, WebP, or PDF certificate files are accepted", statusCode: 415 }
    });
  }
  return express.raw({ type: contentType, limit: "10mb" })(req, res, next);
};

router.post(
  "/project-screenshot",
  requireAuth,
  imageBody,
  UploadController.projectScreenshot
);
router.post(
  "/certificate-file",
  requireAuth,
  certificateFileBody,
  UploadController.certificateFile
);

export default router;
