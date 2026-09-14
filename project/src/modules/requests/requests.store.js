import { pool } from '../../database/pool.js';

export class RequestsStore {
  static async findAll({ status, priority, limit = 50, offset = 0 } = {}) {
    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (priority) {
      values.push(priority);
      conditions.push(`priority = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    values.push(limit);
    const limitParam = `$${values.length}`;
    values.push(offset);
    const offsetParam = `$${values.length}`;

    const query = `
      SELECT id, title, description, priority, status, created_at, updated_at
      FROM requests
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitParam} OFFSET ${offsetParam};
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id, client = pool) {
    const query = `
      SELECT id, title, description, priority, status, created_at, updated_at
      FROM requests
      WHERE id = $1;
    `;
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create({ title, description, priority = 'medium', status = 'open' }, client = pool) {
    const query = `
      INSERT INTO requests (title, description, priority, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, priority, status, created_at, updated_at;
    `;
    const result = await client.query(query, [title, description, priority, status]);
    return result.rows[0];
  }

  static async update(id, fields, client = pool) {
    const updates = [];
    const values = [id];

    if (fields.title !== undefined) {
      values.push(fields.title);
      updates.push(`title = $${values.length}`);
    }

    if (fields.description !== undefined) {
      values.push(fields.description);
      updates.push(`description = $${values.length}`);
    }

    if (fields.priority !== undefined) {
      values.push(fields.priority);
      updates.push(`priority = $${values.length}`);
    }

    if (fields.status !== undefined) {
      values.push(fields.status);
      updates.push(`status = $${values.length}`);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE requests
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING id, title, description, priority, status, created_at, updated_at;
    `;

    const result = await client.query(query, values);
    return result.rows[0] || null;
  }

  static async createStatusHistory({ requestId, previousStatus, newStatus }, client = pool) {
    const query = `
      INSERT INTO request_status_history (request_id, previous_status, new_status)
      VALUES ($1, $2, $3)
      RETURNING id, request_id, previous_status, new_status, changed_at;
    `;
    const result = await client.query(query, [requestId, previousStatus, newStatus]);
    return result.rows[0];
  }

  static async findStatusHistoryByRequestId(requestId, client = pool) {
    const query = `
      SELECT id, request_id, previous_status, new_status, changed_at
      FROM request_status_history
      WHERE request_id = $1
      ORDER BY changed_at ASC;
    `;
    const result = await client.query(query, [requestId]);
    return result.rows;
  }
} 