import { AppError } from '../../app-error.js';
import {
  hashPassword,
  verifyPassword,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from './password.js';
import { issueToken, TOKEN_TTL_SECONDS } from './token.js';
import { findByEmail, findById, insertUser } from '../users/users.store.js';
import { mapUserRow } from '../users/user.mapper.js';

const FORBIDDEN_FIELDS = [
  'role',
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'changedBy',
  'passwordHash',
  'password_hash'
];

export async function register(body) {
  if (!body || typeof body !== 'object') {
    throw new AppError('contract', 'INVALID_BODY', 'Request body must be an object.');
  }

  // 1. Validar lista de campos del servidor (rechazar explícitamente)
  for (const field of FORBIDDEN_FIELDS) {
    if (field in body) {
      throw new AppError(
        'contract',
        'SERVER_CONTROLLED_FIELD',
        `Field '${field}' is controlled by the server and cannot be provided.`
      );
    }
  }

  const { email, password } = body;

  // 2. Validar y normalizar email
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new AppError('contract', 'INVALID_EMAIL', 'A valid email address is required.');
  }
  const normalizedEmail = email.trim().toLowerCase();

  // 3. Validar formato de password (15 a 128 caracteres, permite espacios)
  const minLength = PASSWORD_MIN_LENGTH ?? 15;
  const maxLength = PASSWORD_MAX_LENGTH ?? 128;
  if (
    typeof password !== 'string' ||
    password.length < minLength ||
    password.length > maxLength
  ) {
    throw new AppError(
      'contract',
      'INVALID_PASSWORD',
      `Password must be between ${minLength} and ${maxLength} characters.`
    );
  }

  // 4. Hashear y persistir
  const passwordHash = await hashPassword(password);

  try {
    const row = await insertUser({
      email: normalizedEmail,
      passwordHash,
      role: 'requester'
    });
    return mapUserRow(row);
  } catch (err) {
    if (err.code === '23505') {
      throw new AppError(
        'domain',
        'ACCOUNT_CANNOT_BE_CREATED',
        'The account cannot be created with the supplied information.'
      );
    }
    throw err;
  }
}

export async function login(body) {
  const genericError = () =>
    new AppError('auth', 'INVALID_CREDENTIALS', 'Email or password is incorrect.');

  if (!body || typeof body !== 'object') {
    throw genericError();
  }

  const { email, password } = body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw genericError();
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await findByEmail(normalizedEmail);

  if (!user) {
    // Mitigación de timing side-channel
    await verifyPassword(password, '$scrypt$ln=16384,r=8,p=1$dummy$dummy').catch(() => {});
    throw genericError();
  }

  const isValid = await verifyPassword(password, user.password_hash || user.passwordHash);
  if (!isValid) {
    throw genericError();
  }

  const token = await issueToken({
    userId: user.id,
    role: user.role
  });

  return {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: TOKEN_TTL_SECONDS
  };
}

export async function getCurrentUser(actor) {
  if (!actor || !actor.userId) {
    throw new AppError('auth', 'AUTHENTICATION_REQUIRED', 'Authentication required.');
  }

  const user = await findById(actor.userId);
  if (!user) {
    throw new AppError('auth', 'AUTHENTICATION_REQUIRED', 'User not found.');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
} 