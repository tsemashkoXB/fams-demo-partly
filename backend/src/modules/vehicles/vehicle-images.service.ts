import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';
import { vehicleImagesDir } from '../../config/uploads';
import { PG_POOL } from '../database/database.module';
import { VehicleImage } from './entities/vehicle-image.entity';

type VehicleImageRow = {
  id: number;
  vehicle_id: number;
  relative_path: string;
  display_order: number;
  created_at: Date | string;
};

function mapVehicleImageRow(row: VehicleImageRow): VehicleImage {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    relativePath: row.relative_path,
    displayOrder: row.display_order,
    createdAt: String(row.created_at),
  };
}

@Injectable()
export class VehicleImagesService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async createImage(vehicleId: number, filename: string): Promise<VehicleImage> {
    await fs.mkdir(vehicleImagesDir, { recursive: true });
    const relativePath = path.posix.join('uploads', 'vehicles', filename);

    const orderResult = await this.pool.query<{ next_order: number }>(
      `
        SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order
        FROM vehicle_images
        WHERE vehicle_id = $1
      `,
      [vehicleId]
    );

    const displayOrder = orderResult.rows[0]?.next_order ?? 0;

    const result = await this.pool.query<VehicleImageRow>(
      `
        INSERT INTO vehicle_images (vehicle_id, relative_path, display_order, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, vehicle_id, relative_path, display_order, created_at
      `,
      [vehicleId, relativePath, displayOrder]
    );

    return mapVehicleImageRow(result.rows[0]);
  }

  async deleteImage(vehicleId: number, imageId: number): Promise<void> {
    const result = await this.pool.query<VehicleImageRow>(
      `
        SELECT id, vehicle_id, relative_path, display_order, created_at
        FROM vehicle_images
        WHERE id = $1 AND vehicle_id = $2
      `,
      [imageId, vehicleId]
    );

    const image = result.rows[0];
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.pool.query(`DELETE FROM vehicle_images WHERE id = $1`, [imageId]);

    const filePath = path.resolve(process.cwd(), image.relative_path);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
