import { AppError } from '../app-error.js';
import { verifyToken } from '../modules/auth/token.js';
import { respondError } from '../http/respond-error.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'auth',
        'AUTHENTICATION_REQUIRED',
        'Authentication required. Missing or malformed Bearer token.'
      );
    }

    const token = authHeader.slice(7).trim();
    const payload = await verifyToken(token);

    req.auth = {
      userId: payload.sub,
      role: payload.role
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      respondError(res, err);
    } else {
      respondError(
        res,
        new AppError('auth', 'INVALID_TOKEN', 'The provided token is invalid or expired.')
      );
    }
  }
} 