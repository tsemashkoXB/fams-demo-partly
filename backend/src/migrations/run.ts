import 'dotenv/config';
import { createDatabasePool } from '../config/database';
import { up as up001, down as down001 } from './001_create_vehicles_tables';
import { up as up002, down as down002 } from './002_seed_vehicles';
import {
  up as up003,
  down as down003,
} from './003_alter_vehicle_dates_to_text';
import { up as up004, down as down004 } from './004_create_users_tables';
import { up as up005, down as down005 } from './005_create_user_images_tables';
import { up as up006, down as down006 } from './006_seed_users';
import { up as up007, down as down007 } from './007_create_bookings_table';
import { up as up008, down as down008 } from './008_seed_bookings';

const migrations = [
  { name: '001_create_vehicles_tables', up: up001, down: down001 },
  { name: '002_seed_vehicles', up: up002, down: down002 },
  { name: '003_alter_vehicle_dates_to_text', up: up003, down: down003 },
  { name: '004_create_users_tables', up: up004, down: down004 },
  { name: '005_create_user_images_tables', up: up005, down: down005 },
  { name: '006_seed_users', up: up006, down: down006 },
  { name: '007_create_bookings_table', up: up007, down: down007 },
  { name: '008_seed_bookings', up: up008, down: down008 },
];

type Direction = 'up' | 'down';

async function run(direction: Direction): Promise<void> {
  const pool = createDatabasePool();
  try {
    const sequence =
      direction === 'up' ? migrations : [...migrations].reverse();
    for (const migration of sequence) {
      if (direction === 'up') {
        await migration.up(pool);
      } else {
        await migration.down(pool);
      }
    }
  } finally {
    await pool.end();
  }
}

const direction = (process.argv[2] ?? 'up') as Direction;
if (direction !== 'up' && direction !== 'down') {
  throw new Error('Migration direction must be "up" or "down"');
}

run(direction).catch((error) => {
  console.error(error);
  process.exit(1);
});
