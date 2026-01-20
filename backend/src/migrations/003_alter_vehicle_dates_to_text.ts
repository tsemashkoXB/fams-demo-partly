import { Pool } from 'pg';

const dateColumns = [
  'vehicle_passport_issued_date',
  'insurance_expires_at',
  'next_service_till_date',
  'state_inspection_expires_at',
];

export async function up(pool: Pool): Promise<void> {
  for (const column of dateColumns) {
    await pool.query(
      `
        ALTER TABLE vehicles
        ALTER COLUMN ${column} TYPE TEXT USING ${column}::text
      `
    );
  }
}

export async function down(pool: Pool): Promise<void> {
  for (const column of dateColumns) {
    await pool.query(
      `
        ALTER TABLE vehicles
        ALTER COLUMN ${column} TYPE DATE USING ${column}::date
      `
    );
  }
}
