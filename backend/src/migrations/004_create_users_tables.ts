import { Pool } from 'pg';

export async function up(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      status TEXT NOT NULL,
      gender TEXT NOT NULL,
      position TEXT NOT NULL,
      date_of_birth TEXT,
      contract_termination_date TEXT,
      email TEXT,
      phone TEXT,
      driving_license TEXT,
      driving_license_expires_at TEXT,
      driving_categories TEXT[],
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(pool: Pool): Promise<void> {
  await pool.query(`
    DROP TABLE IF EXISTS users;
  `);
}
