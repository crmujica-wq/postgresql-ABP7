import { pool } from '../db.js';

const publicFields = 'id, name, email, created_at';

export async function findUsers({ name, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  const values = [];
  let where = '';
  if (name) {
    values.push(`%${name}%`);
    where = `WHERE name ILIKE $${values.length}`;
  }
  values.push(limit, offset);
  const query = `SELECT ${publicFields} FROM users ${where} ORDER BY id LIMIT $${values.length - 1} OFFSET $${values.length}`;
  const { rows } = await pool.query(query, values);
  return rows;
}

export async function findUserById(id) {
  const { rows } = await pool.query(`SELECT ${publicFields} FROM users WHERE id = $1`, [id]);
  return rows[0];
}

export async function insertUser({ name, email }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING ${publicFields}`,
    [name, email],
  );
  return rows[0];
}

export async function updateUser(id, { name, email }) {
  const { rows } = await pool.query(
    `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING ${publicFields}`,
    [name ?? null, email ?? null, id],
  );
  return rows[0];
}

export async function removeUser(id) {
  const { rows } = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING ${publicFields}`, [id]);
  return rows[0];
}
