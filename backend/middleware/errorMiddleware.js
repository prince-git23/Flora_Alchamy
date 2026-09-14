/**
 * Central error helpers. Every controller error is normalized to:
 *   { success: false, message, code, status }
 * Stack traces are never sent to clients.
 */
export class ApiError extends Error {
  constructor(status, message, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    return res.status(422).json({ success: false, message, code: 'VALIDATION_ERROR' });
  }

  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
      code: 'DUPLICATE',
    });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
      code: 'NOT_FOUND',
    });
  }

  // Multer upload errors — surface honest 4xx instead of a raw 500.
  if (err.name === 'MulterError') {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 422;
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image is larger than the 5 MB limit.'
        : `Upload rejected: ${err.code}`;
    return res.status(status).json({ success: false, message, code: 'UPLOAD_ERROR' });
  }

  console.error('[api-error]', err);
  return res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred. Please try again.',
    code: 'INTERNAL_ERROR',
  });
}
