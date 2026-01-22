import { Pool } from 'pg';

type SeedUser = {
  name: string;
  surname: string;
  status: string;
  gender: string;
  position: string;
  dateOfBirth: string;
  contractTerminationDate: string;
  email: string;
  phone: string;
  drivingLicense: string;
  drivingLicenseExpiresAt: string;
  drivingCategories: string[];
};

const seedUsers: SeedUser[] = [
  {
    name: 'Elena',
    surname: 'Kravtsov',
    status: 'Active',
    gender: 'Female',
    position: 'Merchandiser',
    dateOfBirth: '1990-06-14',
    contractTerminationDate: '2026-12-31',
    email: 'elena.kravtsov@example.com',
    phone: '+1-555-0101',
    drivingLicense: 'DL-1001',
    drivingLicenseExpiresAt: '2026-02-15',
    drivingCategories: ['B', 'BE'],
  },
  {
    name: 'Mark',
    surname: 'Holmes',
    status: 'Active',
    gender: 'Male',
    position: 'Driver',
    dateOfBirth: '1987-11-02',
    contractTerminationDate: '2025-10-01',
    email: 'mark.holmes@example.com',
    phone: '+1-555-0102',
    drivingLicense: 'DL-1002',
    drivingLicenseExpiresAt: '2025-04-01',
    drivingCategories: ['C', 'CE'],
  },
  {
    name: 'Rita',
    surname: 'Mendoza',
    status: 'Banned',
    gender: 'Female',
    position: 'Sale',
    dateOfBirth: '1995-03-19',
    contractTerminationDate: '2024-12-10',
    email: 'rita.mendoza@example.com',
    phone: '+1-555-0103',
    drivingLicense: 'DL-1003',
    drivingLicenseExpiresAt: '2024-11-30',
    drivingCategories: ['B'],
  },
  {
    name: 'Omar',
    surname: 'Saadi',
    status: 'Active',
    gender: 'Male',
    position: 'Courier',
    dateOfBirth: '1992-08-23',
    contractTerminationDate: '2026-06-20',
    email: 'omar.saadi@example.com',
    phone: '+1-555-0104',
    drivingLicense: 'DL-1004',
    drivingLicenseExpiresAt: '2026-01-05',
    drivingCategories: ['AM', 'A1'],
  },
  {
    name: 'Natalie',
    surname: 'Brooks',
    status: 'Active',
    gender: 'Female',
    position: 'House Master',
    dateOfBirth: '1983-01-07',
    contractTerminationDate: '2025-08-15',
    email: 'natalie.brooks@example.com',
    phone: '+1-555-0105',
    drivingLicense: 'DL-1005',
    drivingLicenseExpiresAt: '2025-07-10',
    drivingCategories: ['B', 'D'],
  },
];

export async function up(pool: Pool): Promise<void> {
  for (const user of seedUsers) {
    await pool.query(
      `
        INSERT INTO users (
          name,
          surname,
          status,
          gender,
          position,
          date_of_birth,
          contract_termination_date,
          email,
          phone,
          driving_license,
          driving_license_expires_at,
          driving_categories,
          created_at,
          updated_at
        )
        SELECT
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          NOW(),
          NOW()
        WHERE NOT EXISTS (
          SELECT 1 FROM users WHERE email = $8
        );
      `,
      [
        user.name,
        user.surname,
        user.status,
        user.gender,
        user.position,
        user.dateOfBirth,
        user.contractTerminationDate,
        user.email,
        user.phone,
        user.drivingLicense,
        user.drivingLicenseExpiresAt,
        user.drivingCategories,
      ]
    );
  }
}

export async function down(pool: Pool): Promise<void> {
  const emails = seedUsers.map((user) => user.email);
  await pool.query(`DELETE FROM users WHERE email = ANY($1::text[])`, [emails]);
}
