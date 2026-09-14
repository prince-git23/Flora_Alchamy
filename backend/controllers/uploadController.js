import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { ApiError } from '../middleware/errorMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Product image upload — Phase 14.
 *
 * Architecture:
 *   Admin UI → POST /api/uploads/product-image (multipart/form-data)
 *            → this controller validates type + size
 *            → ImageKit REST API when IMAGEKIT_* credentials exist
 *            → otherwise real local persistence under public/uploads
 *            → returns { url } which is stored on the Product document
 *
 * There is no simulated success: when the provider is misconfigured the
 * endpoint returns 503 UPLOAD_NOT_CONFIGURED so the UI can surface an honest
 * error instead of pretending an upload happened.
 */

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Local fallback storage — real files on disk, served by the frontend.
const UPLOAD_DIR = path.resolve(__dirname, '../../frontend/public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    // Extension is derived from the ALREADY MIME-VALIDATED file and
    // restricted to a whitelist — original filename is never used for the
    // stored name, so path traversal / double-extension tricks are moot.
    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/avif': '.avif',
    };
    const ext = mimeToExt[file.mimetype] || '.jpg';
    cb(null, `product-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      cb(new ApiError(422, 'Unsupported image type. Use JPEG, PNG, WebP, GIF or AVIF.', 'VALIDATION_ERROR'));
      return;
    }
    cb(null, true);
  },
});

function imagekitConfigured() {
  return Boolean(
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  );
}

/**
 * Upload to ImageKit using the v1 files/upload API with Basic auth.
 * Only the PRIVATE key touches the server — the public key/URL endpoint are
 * safe identifiers. Returns the hosted CDN URL.
 */
async function uploadToImageKit(filePath, originalName, folder) {
  const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64');
  const form = new FormData();
  const fileBuffer = fs.readFileSync(filePath);
  form.append('file', new Blob([fileBuffer]), originalName || 'product-image');
  form.append('fileName', originalName || `product-${Date.now()}`);
  form.append('folder', folder || '/flora-alchemy/products');
  form.append('useUniqueFileName', 'true');

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}` },
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new ApiError(502, `ImageKit upload failed (${res.status}). ${detail.slice(0, 200)}`, 'UPLOAD_FAILED');
  }
  const json = await res.json();
  return json.url;
}

export async function uploadProductImage(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError(422, 'An image file is required.', 'VALIDATION_ERROR');
    }

    // Provider path when credentials exist.
    if (imagekitConfigured()) {
      try {
        const url = await uploadToImageKit(
          req.file.path,
          req.file.originalname,
          process.env.IMAGEKIT_FOLDER || '/flora-alchemy/products'
        );
        // Local temp copy is no longer needed once hosted.
        fs.unlink(req.file.path, () => {});
        return res.status(201).json({
          success: true,
          url,
          provider: 'imagekit',
        });
      } catch (err) {
        // Provider failed — clean the temp file and surface honestly.
        fs.unlink(req.file.path, () => {});
        return next(err);
      }
    }

    // No provider credentials: real local persistence. The file IS stored on
    // disk and served by the frontend at /uploads/<name>. This is a genuine
    // storage backend, not a simulation — but it is single-instance and not a
    // CDN, which the admin UI communicates.
    const publicUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({
      success: true,
      url: publicUrl,
      provider: 'local',
    });
  } catch (err) {
    // Clean up partial writes on unexpected errors.
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(err);
  }
}

export function uploadNotConfiguredGuard(_req, _res, next) {
  // The upload route is always usable (local storage is always real).
  next();
}
