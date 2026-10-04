// Central translation of errors into the API's safe response contract.
import { AppError } from '../app-error.js';
import { logger } from '../logging/logger.js';

const CATEGORY_STATUS = {
  contract: 400,
  auth: 401,
  forbidden: 403,
  resource: 404,
  domain: 409
};

const INFRASTRUCTURE_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
  'EAI_AGAIN',
  '57P03'
]);

function safeErrorText(value) {
  return String(value ?? '')
    .replace(/postgres(?:ql)?:\/\/[^\s"'<>]+/gi, '[redacted database URL]')
    .replace(/authorization\s*[:=]\s*[^\r\n,;]*/gi, '[redacted authorization]')
    .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, '[redacted bearer token]')
    .replace(/(password|passwd|pwd)=([^;\s]+)/gi, '$1=[redacted]');
}

export function logTechnicalFailure(event, error, requestId) {
  logger.error(event, {
    requestId,
    errorName: safeErrorText(error?.name || typeof error),
    errorCode: safeErrorText(error?.code),
    errorMessage: safeErrorText(error?.message ?? error),
    errorStack: safeErrorText(error?.stack)
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const requestId = req.requestId;

  if (error instanceof AppError && Object.hasOwn(CATEGORY_STATUS, error.category)) {
    res.locals.errorCode = error.code;
    return res.status(CATEGORY_STATUS[error.category]).json({
      error: { code: error.code, message: error.message },
      requestId
    });
  }

  if (error?.type === 'entity.parse.failed') {
    res.locals.errorCode = 'INVALID_JSON';
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'The request body must contain valid JSON.' },
      requestId
    });
  }

  const isDatabaseUnavailable = INFRASTRUCTURE_CODES.has(error?.code)
    || /connection terminated/i.test(error?.message ?? '');
  if (isDatabaseUnavailable) {
    res.locals.errorCode = 'DATABASE_UNAVAILABLE';
    logTechnicalFailure('database_unavailable', error, requestId);
    return res.status(503).json({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'The service cannot access its data store.'
      },
      requestId
    });
  }

  res.locals.errorCode = 'INTERNAL_ERROR';
  logTechnicalFailure('unexpected_error', error, requestId);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.'
    },
    requestId
  });
}
