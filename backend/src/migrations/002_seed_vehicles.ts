import { Pool } from 'pg';

const seedPlates = [
  'AA-1010',
  'BB-2020',
  'CC-3030',
  'DD-4040',
  'EE-5050',
];

export async function up(pool: Pool): Promise<void> {
  await pool.query(
    `
    INSERT INTO vehicles (
      plate_number,
      model_name,
      type,
      year_of_production,
      vin,
      current_mileage,
      color,
      engine,
      fuel_type,
      payload,
      seats,
      full_mass,
      vehicle_passport,
      vehicle_passport_issued_date,
      insurance,
      insurance_expires_at,
      next_service_at_mileage,
      next_service_till_date,
      state_inspection_expires_at,
      created_at,
      updated_at
    ) VALUES
      ($1, 'Transit 250', 'Van', 2019, 'VIN00000000000001', 54000, 'White', '2.0L', 'Diesel', 950, 3, 2800, 'VP-1001', '2019-03-12T00:00:00.000Z', 'INS-2001', '2025-01-15T00:00:00.000Z', 55000, '2024-12-15T00:00:00.000Z', '2025-02-10T00:00:00.000Z', NOW(), NOW()),
      ($2, 'City Rider', 'Bus', 2016, 'VIN00000000000002', 160000, 'Blue', '5.9L', 'Diesel', 0, 30, 8200, 'VP-1002', '2016-06-04T00:00:00.000Z', 'INS-2002', '2024-11-20T00:00:00.000Z', 165000, '2024-10-30T00:00:00.000Z', '2024-12-02T00:00:00.000Z', NOW(), NOW()),
      ($3, 'Compact Move', 'PC', 2021, 'VIN00000000000003', 22000, 'Red', '1.6L', 'Petrol', 350, 5, 1850, 'VP-1003', '2021-05-18T00:00:00.000Z', 'INS-2003', '2024-09-10T00:00:00.000Z', 25000, '2024-08-15T00:00:00.000Z', '2025-03-05T00:00:00.000Z', NOW(), NOW()),
      ($4, 'Tourer XL', 'Pass Van', 2018, 'VIN00000000000004', 78000, 'Silver', '2.4L', 'Gas', 600, 8, 3100, 'VP-1004', '2018-09-22T00:00:00.000Z', 'INS-2004', '2024-07-01T00:00:00.000Z', 80000, '2024-06-20T00:00:00.000Z', '2024-09-18T00:00:00.000Z', NOW(), NOW()),
      ($5, 'Cargo Pro', 'CV', 2020, 'VIN00000000000005', 64000, 'Gray', '3.0L', 'Diesel', 1200, 2, 3500, 'VP-1005', '2020-02-14T00:00:00.000Z', 'INS-2005', '2025-04-12T00:00:00.000Z', 65000, '2025-03-20T00:00:00.000Z', '2025-05-01T00:00:00.000Z', NOW(), NOW())
    ON CONFLICT (plate_number) DO NOTHING;
    `,
    seedPlates
  );
}

export async function down(pool: Pool): Promise<void> {
  await pool.query(`
    DELETE FROM vehicles WHERE plate_number = ANY($1::text[]);
  `, [seedPlates]);
}
