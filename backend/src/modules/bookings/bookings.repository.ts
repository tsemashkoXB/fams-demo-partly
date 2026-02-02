import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import {
  Booking,
  BookingWithDetails,
  CreateBookingDto,
  UpdateBookingDto,
} from './entities/booking.entity';

type BookingRow = {
  id: number;
  vehicle_id: number;
  user_id: number;
  status: string;
  start_time: Date | string;
  end_time: Date | string;
  description: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type BookingWithDetailsRow = BookingRow & {
  vehicle_plate_number: string;
  vehicle_model_name: string;
  vehicle_type: string;
  user_name: string;
  user_surname: string;
};

function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    userId: row.user_id,
    status: row.status as Booking['status'],
    startTime: new Date(row.start_time).toISOString(),
    endTime: new Date(row.end_time).toISOString(),
    description: row.description,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapBookingWithDetailsRow(
  row: BookingWithDetailsRow,
): BookingWithDetails {
  return {
    ...mapBookingRow(row),
    vehicle: {
      id: row.vehicle_id,
      plateNumber: row.vehicle_plate_number,
      modelName: row.vehicle_model_name,
      type: row.vehicle_type,
    },
    user: {
      id: row.user_id,
      name: row.user_name,
      surname: row.user_surname,
    },
  };
}

export interface BookingFilters {
  vehicleId?: number;
  userId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ConflictingBooking {
  id: number;
  startTime: string;
  endTime: string;
}

@Injectable()
export class BookingsRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async listBookings(
    filters: BookingFilters = {},
  ): Promise<BookingWithDetails[]> {
    const conditions: string[] = [];
    const values: Array<string | number> = [];
    let paramIndex = 1;

    if (filters.vehicleId !== undefined) {
      conditions.push(`b.vehicle_id = $${paramIndex}`);
      values.push(filters.vehicleId);
      paramIndex++;
    }

    if (filters.userId !== undefined) {
      conditions.push(`b.user_id = $${paramIndex}`);
      values.push(filters.userId);
      paramIndex++;
    }

    if (filters.status !== undefined) {
      conditions.push(`b.status = $${paramIndex}`);
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.startDate !== undefined) {
      conditions.push(`b.end_time > $${paramIndex}`);
      values.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate !== undefined) {
      conditions.push(`b.start_time < $${paramIndex}`);
      values.push(filters.endDate);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await this.pool.query<BookingWithDetailsRow>(
      `
        SELECT
          b.id,
          b.vehicle_id,
          b.user_id,
          b.status,
          b.start_time,
          b.end_time,
          b.description,
          b.created_at,
          b.updated_at,
          v.plate_number AS vehicle_plate_number,
          v.model_name AS vehicle_model_name,
          v.type AS vehicle_type,
          u.name AS user_name,
          u.surname AS user_surname
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON b.user_id = u.id
        ${whereClause}
        ORDER BY b.start_time ASC, b.id ASC
      `,
      values,
    );

    return result.rows.map(mapBookingWithDetailsRow);
  }

  async getBookingById(id: number): Promise<BookingWithDetails | null> {
    const result = await this.pool.query<BookingWithDetailsRow>(
      `
        SELECT
          b.id,
          b.vehicle_id,
          b.user_id,
          b.status,
          b.start_time,
          b.end_time,
          b.description,
          b.created_at,
          b.updated_at,
          v.plate_number AS vehicle_plate_number,
          v.model_name AS vehicle_model_name,
          v.type AS vehicle_type,
          u.name AS user_name,
          u.surname AS user_surname
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON b.user_id = u.id
        WHERE b.id = $1
      `,
      [id],
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return mapBookingWithDetailsRow(row);
  }

  async createBooking(input: CreateBookingDto): Promise<BookingWithDetails> {
    const result = await this.pool.query<BookingRow>(
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
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING
          id,
          vehicle_id,
          user_id,
          status,
          start_time,
          end_time,
          description,
          created_at,
          updated_at
      `,
      [
        input.vehicleId,
        input.userId,
        input.status ?? 'In work',
        input.startTime,
        input.endTime,
        input.description ?? null,
      ],
    );

    const booking = mapBookingRow(result.rows[0]);
    const withDetails = await this.getBookingById(booking.id);
    return withDetails!;
  }

  async updateBooking(
    id: number,
    input: UpdateBookingDto,
  ): Promise<BookingWithDetails | null> {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let paramIndex = 1;

    const addField = (column: string, value: string | number | null) => {
      fields.push(`${column} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    };

    if (input.vehicleId !== undefined) addField('vehicle_id', input.vehicleId);
    if (input.userId !== undefined) addField('user_id', input.userId);
    if (input.status !== undefined) addField('status', input.status);
    if (input.startTime !== undefined) addField('start_time', input.startTime);
    if (input.endTime !== undefined) addField('end_time', input.endTime);
    if (input.description !== undefined)
      addField('description', input.description);

    if (fields.length === 0) {
      return this.getBookingById(id);
    }

    values.push(id);

    const result = await this.pool.query<BookingRow>(
      `
        UPDATE bookings
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING
          id,
          vehicle_id,
          user_id,
          status,
          start_time,
          end_time,
          description,
          created_at,
          updated_at
      `,
      values,
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return this.getBookingById(row.id);
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM bookings WHERE id = $1 RETURNING id`,
      [id],
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async findOverlappingBooking(
    vehicleId: number,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ): Promise<ConflictingBooking | null> {
    const result = await this.pool.query<BookingRow>(
      `
        SELECT id, start_time, end_time
        FROM bookings
        WHERE vehicle_id = $1
          AND ($4::bigint IS NULL OR id != $4)
          AND start_time < $3
          AND end_time > $2
        LIMIT 1
      `,
      [vehicleId, startTime, endTime, excludeId ?? null],
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      startTime: new Date(row.start_time).toISOString(),
      endTime: new Date(row.end_time).toISOString(),
    };
  }

  async getAvailableVehicleIds(
    startDate: string,
    endDate: string,
  ): Promise<number[]> {
    const result = await this.pool.query<{ id: number }>(
      `
        SELECT v.id
        FROM vehicles v
        WHERE NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.vehicle_id = v.id
            AND b.start_time < $2
            AND b.end_time > $1
        )
        ORDER BY v.id ASC
      `,
      [startDate, endDate],
    );

    return result.rows.map((row) => row.id);
  }
}
