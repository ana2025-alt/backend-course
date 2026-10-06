// Authentication middleware: establishes WHO the actor is, and nothing
// more. It never decides what the actor may do — that is authorization,
// and it lives in the module policies.
import { AppError } from '../app-error.js';
<<<<<<< HEAD
=======
import { respondError } from '../http/respond-error.js';
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
import { verifyToken } from '../modules/auth/token.js';

const ROLES = ['requester', 'agent'];

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    // The scheme must be exactly Bearer: "Basic ..." or a bare token is
    // not a trustworthy identity.
    if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
      throw new AppError('auth', 'AUTHENTICATION_REQUIRED',
        'This operation requires a Bearer token.');
    }
    const token = header.slice('Bearer '.length).trim();
    if (token === '') {
      throw new AppError('auth', 'AUTHENTICATION_REQUIRED',
        'This operation requires a Bearer token.');
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      // Altered, expired, wrong issuer/audience/signature: same answer.
      // The response never explains which check failed.
      throw new AppError('auth', 'INVALID_TOKEN',
        'The token is invalid or has expired.');
    }

    if (typeof payload.sub !== 'string' || !ROLES.includes(payload.role)) {
      throw new AppError('auth', 'INVALID_TOKEN',
        'The token is invalid or has expired.');
    }

    // The only trusted source of identity for the rest of the request.
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch (error) {
<<<<<<< HEAD
    next(error);
=======
    respondError(res, error);
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
  }
}
