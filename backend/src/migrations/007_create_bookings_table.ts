import { Pool } from 'pg';

export async function up(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id BIGSERIAL PRIMARY KEY,
      vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'In work',
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT bookings_status_check CHECK (status IN ('In work', 'Service')),
      CONSTRAINT bookings_time_order_check CHECK (end_time > start_time)
    );

    CREATE INDEX IF NOT EXISTS bookings_vehicle_id_idx ON bookings(vehicle_id);
    CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS bookings_vehicle_time_idx ON bookings(vehicle_id, start_time, end_time);
    CREATE INDEX IF NOT EXISTS bookings_time_range_idx ON bookings(start_time, end_time);
  `);
}

export async function down(pool: Pool): Promise<void> {
  await pool.query(`
    DROP TABLE IF EXISTS bookings;
  `);
}
