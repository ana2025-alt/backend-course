// Validates or generates the request identifier used by responses and logs.
import { randomUUID } from 'node:crypto';

export function requestId(req, res, next) {
  const suppliedId = req.get('X-Request-Id');
  const trustedId = typeof suppliedId === 'string'
    && /^[A-Za-z0-9._-]{1,64}$/.test(suppliedId);

  req.requestId = trustedId ? suppliedId : `req_${randomUUID()}`;
  res.set('X-Request-Id', req.requestId);
  next();
}
