import { Pool } from 'pg';

// Generate 20 demo bookings spread across vehicles and dates
const generateSeedBookings = () => {
  const now = new Date();
  const bookings: Array<{
    vehicleId: number;
    userId: number;
    status: 'In work' | 'Service';
    startTime: string;
    endTime: string;
    description: string;
  }> = [];

  // Get base date (start of current week)
  const baseDate = new Date(now);
  baseDate.setDate(baseDate.getDate() - baseDate.getDay());
  baseDate.setHours(0, 0, 0, 0);

  // Vehicle 1 bookings (Transit 250 - Van)
  bookings.push({
    vehicleId: 1,
    userId: 1,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    ).toISOString(), // Monday 8am
    endTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000,
    ).toISOString(), // Monday 12pm
    description: 'Downtown delivery route',
  });
  bookings.push({
    vehicleId: 1,
    userId: 2,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000,
    ).toISOString(), // Monday 2pm
    endTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000,
    ).toISOString(), // Monday 6pm
    description: 'Warehouse pickup',
  });
  bookings.push({
    vehicleId: 1,
    userId: 1,
    status: 'Service',
    startTime: new Date(
      baseDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
    ).toISOString(), // Wednesday 9am
    endTime: new Date(
      baseDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000,
    ).toISOString(), // Wednesday 5pm
    description: 'Oil change and tire rotation',
  });

  // Vehicle 2 bookings (City Rider - Bus)
  bookings.push({
    vehicleId: 2,
    userId: 3,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000,
    ).toISOString(), // Monday 6am
    endTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000,
    ).toISOString(), // Monday 2pm
    description: 'Morning shuttle service',
  });
  bookings.push({
    vehicleId: 2,
    userId: 4,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000,
    ).toISOString(), // Tuesday 7am
    endTime: new Date(
      baseDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000,
    ).toISOString(), // Tuesday 3pm
    description: 'Employee transport',
  });
  bookings.push({
    vehicleId: 2,
    userId: 5,
    status: 'Service',
    startTime: new Date(
      baseDate.getTime() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    ).toISOString(), // Friday 8am
    endTime: new Date(
      baseDate.getTime() + 6 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000,
    ).toISOString(), // Saturday 5pm
    description: 'Brake inspection and repair',
  });

  // Vehicle 3 bookings (Compact Move - PC)
  bookings.push({
    vehicleId: 3,
    userId: 1,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 0 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000,
    ).toISOString(), // Sunday 10am
    endTime: new Date(
      baseDate.getTime() + 0 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000,
    ).toISOString(), // Sunday 4pm
    description: 'Client meeting transport',
  });
  bookings.push({
    vehicleId: 3,
    userId: 2,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
    ).toISOString(), // Tuesday 9am
    endTime: new Date(
      baseDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000,
    ).toISOString(), // Tuesday 1pm
    description: 'Sales visit - North district',
  });
  bookings.push({
    vehicleId: 3,
    userId: 3,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 4 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    ).toISOString(), // Thursday 8am
    endTime: new Date(
      baseDate.getTime() + 4 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000,
    ).toISOString(), // Thursday 6pm
    description: 'Full day client visits',
  });

  // Vehicle 4 bookings (Tourer XL - Pass Van)
  bookings.push({
    vehicleId: 4,
    userId: 4,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000,
    ).toISOString(), // Monday 7am
    endTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000,
    ).toISOString(), // Monday 7pm
    description: 'Airport transfers',
  });
  bookings.push({
    vehicleId: 4,
    userId: 5,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    ).toISOString(), // Wednesday 8am
    endTime: new Date(
      baseDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000,
    ).toISOString(), // Wednesday 4pm
    description: 'Team offsite transport',
  });
  bookings.push({
    vehicleId: 4,
    userId: 1,
    status: 'Service',
    startTime: new Date(
      baseDate.getTime() + 4 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
    ).toISOString(), // Thursday 9am
    endTime: new Date(
      baseDate.getTime() + 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000,
    ).toISOString(), // Thursday 12pm
    description: 'AC system check',
  });

  // Vehicle 5 bookings (Cargo Pro - CV)
  bookings.push({
    vehicleId: 5,
    userId: 2,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
    ).toISOString(), // Monday 5am
    endTime: new Date(
      baseDate.getTime() + 1 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000,
    ).toISOString(), // Monday 1pm
    description: 'Heavy cargo delivery',
  });
  bookings.push({
    vehicleId: 5,
    userId: 3,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000,
    ).toISOString(), // Tuesday 6am
    endTime: new Date(
      baseDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000,
    ).toISOString(), // Tuesday 2pm
    description: 'Warehouse restocking',
  });
  bookings.push({
    vehicleId: 5,
    userId: 4,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
    ).toISOString(), // Wednesday 4am
    endTime: new Date(
      baseDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000,
    ).toISOString(), // Wednesday 12pm
    description: 'Early morning bulk delivery',
  });
  bookings.push({
    vehicleId: 5,
    userId: 5,
    status: 'Service',
    startTime: new Date(
      baseDate.getTime() + 6 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    ).toISOString(), // Saturday 8am
    endTime: new Date(
      baseDate.getTime() + 6 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000,
    ).toISOString(), // Saturday 6pm
    description: 'Full service maintenance',
  });

  // Additional bookings for next week
  bookings.push({
    vehicleId: 1,
    userId: 3,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 8 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
    ).toISOString(), // Next Monday 9am
    endTime: new Date(
      baseDate.getTime() + 8 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000,
    ).toISOString(), // Next Monday 5pm
    description: 'Regional delivery run',
  });
  bookings.push({
    vehicleId: 2,
    userId: 1,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 9 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    ).toISOString(), // Next Tuesday 8am
    endTime: new Date(
      baseDate.getTime() + 9 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000,
    ).toISOString(), // Next Tuesday 4pm
    description: 'Corporate event shuttle',
  });
  bookings.push({
    vehicleId: 3,
    userId: 4,
    status: 'In work',
    startTime: new Date(
      baseDate.getTime() + 10 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000,
    ).toISOString(), // Next Wednesday 10am
    endTime: new Date(
      baseDate.getTime() + 10 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000,
    ).toISOString(), // Next Wednesday 3pm
    description: 'Client presentation',
  });
  bookings.push({
    vehicleId: 4,
    userId: 2,
    status: 'Service',
    startTime: new Date(
      baseDate.getTime() + 11 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000,
    ).toISOString(), // Next Thursday 7am
    endTime: new Date(
      baseDate.getTime() + 11 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000,
    ).toISOString(), // Next Thursday 7pm
    description: 'Transmission service',
  });

  return bookings;
};

export async function up(pool: Pool): Promise<void> {
  const bookings = generateSeedBookings();

  for (const booking of bookings) {
    await pool.query(
      `
        INSERT INTO bookings (
          vehicle_id,
          user_id,
          status,
          start_time,
          end_time,
          description,
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
          NOW(),
          NOW()
        WHERE EXISTS (SELECT 1 FROM vehicles WHERE id = $1)
          AND EXISTS (SELECT 1 FROM users WHERE id = $2);
      `,
      [
        booking.vehicleId,
        booking.userId,
        booking.status,
        booking.startTime,
        booking.endTime,
        booking.description,
      ],
    );
  }
}

export async function down(pool: Pool): Promise<void> {
  // Delete seeded bookings (all bookings with descriptions matching seed data)
  await pool.query(`
    DELETE FROM bookings 
    WHERE description IN (
      'Downtown delivery route',
      'Warehouse pickup',
      'Oil change and tire rotation',
      'Morning shuttle service',
      'Employee transport',
      'Brake inspection and repair',
      'Client meeting transport',
      'Sales visit - North district',
      'Full day client visits',
      'Airport transfers',
      'Team offsite transport',
      'AC system check',
      'Heavy cargo delivery',
      'Warehouse restocking',
      'Early morning bulk delivery',
      'Full service maintenance',
      'Regional delivery run',
      'Corporate event shuttle',
      'Client presentation',
      'Transmission service'
    );
  `);
}
