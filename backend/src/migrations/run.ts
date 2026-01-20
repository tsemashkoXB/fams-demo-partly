import 'dotenv/config';
import { createDatabasePool } from '../config/database';
import { up as up001, down as down001 } from './001_create_vehicles_tables';
import { up as up002, down as down002 } from './002_seed_vehicles';
import { up as up003, down as down003 } from './003_alter_vehicle_dates_to_text';

const migrations = [
  { name: '001_create_vehicles_tables', up: up001, down: down001 },
  { name: '002_seed_vehicles', up: up002, down: down002 },
  { name: '003_alter_vehicle_dates_to_text', up: up003, down: down003 },
];

type Direction = 'up' | 'down';

async function run(direction: Direction): Promise<void> {
  const pool = createDatabasePool();
  try {
    const sequence = direction === 'up' ? migrations : [...migrations].reverse();
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
