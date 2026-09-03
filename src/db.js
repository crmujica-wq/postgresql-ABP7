import pg from 'pg';
import { dbConfig } from './config.js';

export const pool = new pg.Pool(dbConfig);

export async function connectDatabase() {
  const { rows } = await pool.query('SELECT NOW() AS connected_at');
  console.log(`PostgreSQL conectado: ${rows[0].connected_at.toISOString()}`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_histories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
