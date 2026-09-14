import { pool } from '../../database/pool.js';

export async function insertUser({ email, passwordHash, role = 'requester' }) {
  const query = `
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING id, email, role, created_at;
  `;
  const result = await pool.query(query, [email, passwordHash, role]);
  return result.rows[0];
}

export async function findByEmail(email) {
  const query = `
    SELECT id, email, password_hash, role, created_at
    FROM users
    WHERE email = $1;
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}

export async function findById(id) {
  const query = `
    SELECT id, email, role, created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
} 