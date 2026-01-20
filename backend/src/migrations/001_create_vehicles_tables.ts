import { Pool } from 'pg';

export async function up(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id BIGSERIAL PRIMARY KEY,
      plate_number TEXT NOT NULL UNIQUE,
      model_name TEXT NOT NULL,
      type TEXT NOT NULL,
      year_of_production INTEGER NOT NULL,
      vin TEXT NOT NULL UNIQUE,
      current_mileage INTEGER NOT NULL DEFAULT 0,
      color TEXT,
      engine TEXT,
      fuel_type TEXT,
      payload NUMERIC,
      seats INTEGER,
      full_mass NUMERIC,
      vehicle_passport TEXT,
      vehicle_passport_issued_date TEXT,
      insurance TEXT,
      insurance_expires_at TEXT,
      next_service_at_mileage INTEGER,
      next_service_till_date TEXT,
      state_inspection_expires_at TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS vehicle_images (
      id BIGSERIAL PRIMARY KEY,
      vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      relative_path TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS vehicle_images_vehicle_id_idx
      ON vehicle_images(vehicle_id);
  `);
}

export async function down(pool: Pool): Promise<void> {
  await pool.query(`
    DROP TABLE IF EXISTS vehicle_images;
    DROP TABLE IF EXISTS vehicles;
  `);
}
