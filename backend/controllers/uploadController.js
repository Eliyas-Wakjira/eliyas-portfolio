import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { JsonView } from "../views/jsonView.js";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const MAX_CERTIFICATE_FILE_SIZE = 10 * 1024 * 1024;
const IMAGE_SIGNATURES = [
  { mime: "image/jpeg", extension: ".jpg", matches: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  { mime: "image/png", extension: ".png", matches: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  { mime: "image/webp", extension: ".webp", matches: (buffer) => buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" }
];
const CERTIFICATE_FILE_SIGNATURES = [
  ...IMAGE_SIGNATURES,
  { mime: "application/pdf", extension: ".pdf", matches: (buffer) => buffer.subarray(0, 5).toString("ascii") === "%PDF-" }
];

async function saveUpload(image, signature) {
  const uploadDirectory = path.resolve(process.cwd(), "public", "frontend", "assets", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  const filename = `${randomUUID()}${signature.extension}`;
  await writeFile(path.join(uploadDirectory, filename), image, { flag: "wx" });
  return {
    url: `/frontend/assets/uploads/${filename}`,
    mimeType: signature.mime,
    size: image.length
  };
}

class UploadController {
  static async projectScreenshot(req, res, next) {
    const image = Buffer.isBuffer(req.body) ? req.body : null;
    if (!image?.length || image.length > MAX_UPLOAD_SIZE) {
      return JsonView.renderError(res, "Choose an image file no larger than 5 MB", 400);
    }

    const signature = IMAGE_SIGNATURES.find((item) => item.mime === req.get("content-type") && item.matches(image));
    if (!signature) return JsonView.renderError(res, "Only valid JPEG, PNG, or WebP images are allowed", 415);

    try {
      return JsonView.renderSuccess(res, await saveUpload(image, signature), undefined, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async certificateFile(req, res, next) {
    const file = Buffer.isBuffer(req.body) ? req.body : null;
    if (!file?.length || file.length > MAX_CERTIFICATE_FILE_SIZE) {
      return JsonView.renderError(res, "Choose a certificate file no larger than 10 MB", 400);
    }

    const signature = CERTIFICATE_FILE_SIGNATURES.find(
      (item) => item.mime === req.get("content-type") && item.matches(file)
    );
    if (!signature) {
      return JsonView.renderError(res, "Upload a valid JPEG, PNG, WebP, or PDF certificate file", 415);
    }

    try {
      return JsonView.renderSuccess(res, await saveUpload(file, signature), undefined, 201);
    } catch (error) {
      return next(error);
    }
  }
}

export { UploadController };
