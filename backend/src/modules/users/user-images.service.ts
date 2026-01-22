import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';
import { userImagesDir } from '../../config/uploads';
import { PG_POOL } from '../database/database.module';
import { UserImage } from './entities/user-image.entity';

type UserImageRow = {
  id: number;
  user_id: number;
  relative_path: string;
  display_order: number;
  created_at: Date | string;
};

function mapUserImageRow(row: UserImageRow): UserImage {
  return {
    id: row.id,
    userId: row.user_id,
    relativePath: row.relative_path,
    displayOrder: row.display_order,
    createdAt: String(row.created_at),
  };
}

@Injectable()
export class UserImagesService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async createImage(userId: number, filename: string): Promise<UserImage> {
    await fs.mkdir(userImagesDir, { recursive: true });
    const relativePath = path.posix.join('uploads', 'users', filename);

    const orderResult = await this.pool.query<{ next_order: number }>(
      `
        SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order
        FROM user_images
        WHERE user_id = $1
      `,
      [userId]
    );

    const displayOrder = orderResult.rows[0]?.next_order ?? 0;

    const result = await this.pool.query<UserImageRow>(
      `
        INSERT INTO user_images (user_id, relative_path, display_order, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, user_id, relative_path, display_order, created_at
      `,
      [userId, relativePath, displayOrder]
    );

    return mapUserImageRow(result.rows[0]);
  }

  async deleteImage(userId: number, imageId: number): Promise<void> {
    const result = await this.pool.query<UserImageRow>(
      `
        SELECT id, user_id, relative_path, display_order, created_at
        FROM user_images
        WHERE id = $1 AND user_id = $2
      `,
      [imageId, userId]
    );

    const image = result.rows[0];
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.pool.query(`DELETE FROM user_images WHERE id = $1`, [imageId]);

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
