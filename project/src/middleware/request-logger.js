// Logs one allowlisted JSON event when the response has its final status.
import { logger } from '../logging/logger.js';

export function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const fields = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Number(process.hrtime.bigint() - startedAt) / 1e6
    };

    if (req.auth?.userId) fields.userId = req.auth.userId;
    if (res.locals.errorCode) fields.errorCode = res.locals.errorCode;

    if (res.statusCode >= 500) {
      logger.error('request_failed', fields);
    } else {
      logger.info('request_completed', fields);
    }
  });

  next();
}
