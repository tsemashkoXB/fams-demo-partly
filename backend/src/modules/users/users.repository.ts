import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import {
  DrivingCategory,
  User,
  UserGender,
  UserPosition,
  UserStatus,
} from './entities/user.entity';
import { UserImage } from './entities/user-image.entity';

type UserRow = {
  id: number;
  name: string;
  surname: string;
  status: string;
  gender: string;
  position: string;
  date_of_birth: Date | string | null;
  contract_termination_date: Date | string | null;
  email: string | null;
  phone: string | null;
  driving_license: string | null;
  driving_license_expires_at: Date | string | null;
  driving_categories: string[] | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export type UserCreateInput = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'images'
>;
export type UserUpdateInput = Partial<UserCreateInput>;

type UserImageRow = {
  id: number;
  user_id: number;
  relative_path: string;
  display_order: number;
  created_at: Date | string;
};

function toNullableString(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }
  return String(value);
}

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    surname: row.surname,
    status: row.status as UserStatus,
    gender: row.gender as UserGender,
    position: row.position as UserPosition,
    dateOfBirth: toNullableString(row.date_of_birth),
    contractTerminationDate: toNullableString(row.contract_termination_date),
    email: row.email,
    phone: row.phone,
    drivingLicense: row.driving_license,
    drivingLicenseExpiresAt: toNullableString(row.driving_license_expires_at),
    drivingCategories: row.driving_categories as DrivingCategory[] | null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

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
export class UsersRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async listUsers(search?: string): Promise<User[]> {
    const values: string[] = [];
    let whereClause = '';

    if (search) {
      values.push(`%${search}%`);
      whereClause = `
        WHERE
          name ILIKE $1 OR
          surname ILIKE $1 OR
          status ILIKE $1 OR
          gender ILIKE $1 OR
          position ILIKE $1 OR
          COALESCE(date_of_birth, '') ILIKE $1 OR
          COALESCE(contract_termination_date, '') ILIKE $1 OR
          COALESCE(email, '') ILIKE $1 OR
          COALESCE(phone, '') ILIKE $1 OR
          COALESCE(driving_license, '') ILIKE $1 OR
          COALESCE(driving_license_expires_at, '') ILIKE $1 OR
          COALESCE(array_to_string(driving_categories, ','), '') ILIKE $1
      `;
    }

    const result = await this.pool.query<UserRow>(
      `
        SELECT
          id,
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
        FROM users
        ${whereClause}
        ORDER BY id ASC
      `,
      values
    );

    const users = result.rows.map(mapUserRow);
    if (users.length === 0) {
      return users;
    }

    const userIds = users.map((user) => user.id);
    const images = await this.listUserImagesByIds(userIds);
    const imagesByUser = new Map<number, UserImage[]>();
    for (const image of images) {
      const current = imagesByUser.get(image.userId) ?? [];
      current.push(image);
      imagesByUser.set(image.userId, current);
    }

    return users.map((user) => ({
      ...user,
      images: imagesByUser.get(user.id) ?? [],
    }));
  }

  async getUser(userId: number): Promise<User | null> {
    const result = await this.pool.query<UserRow>(
      `
        SELECT
          id,
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
        FROM users
        WHERE id = $1
      `,
      [userId]
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    const images = await this.listUserImagesByIds([userId]);
    return {
      ...mapUserRow(row),
      images,
    };
  }

  async updateUser(userId: number, input: UserUpdateInput): Promise<User | null> {
    const fields: string[] = [];
    const values: Array<string | string[] | null> = [];
    let index = 1;

    const setField = (column: string, value: string | string[] | null) => {
      fields.push(`${column} = $${index}`);
      values.push(value);
      index += 1;
    };

    if (input.name !== undefined) {
      setField('name', input.name);
    }
    if (input.surname !== undefined) {
      setField('surname', input.surname);
    }
    if (input.status !== undefined) {
      setField('status', input.status);
    }
    if (input.gender !== undefined) {
      setField('gender', input.gender);
    }
    if (input.position !== undefined) {
      setField('position', input.position);
    }
    if (input.dateOfBirth !== undefined) {
      setField('date_of_birth', input.dateOfBirth);
    }
    if (input.contractTerminationDate !== undefined) {
      setField('contract_termination_date', input.contractTerminationDate);
    }
    if (input.email !== undefined) {
      setField('email', input.email);
    }
    if (input.phone !== undefined) {
      setField('phone', input.phone);
    }
    if (input.drivingLicense !== undefined) {
      setField('driving_license', input.drivingLicense);
    }
    if (input.drivingLicenseExpiresAt !== undefined) {
      setField('driving_license_expires_at', input.drivingLicenseExpiresAt);
    }
    if (input.drivingCategories !== undefined) {
      setField('driving_categories', input.drivingCategories);
    }

    if (fields.length === 0) {
      return this.getUser(userId);
    }

    fields.push(`updated_at = NOW()`);

    const result = await this.pool.query<UserRow>(
      `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = $${index}
        RETURNING
          id,
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
      `,
      [...values, userId]
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    const images = await this.listUserImagesByIds([row.id]);
    return {
      ...mapUserRow(row),
      images,
    };
  }

  async createUser(input: UserCreateInput): Promise<User> {
    const result = await this.pool.query<UserRow>(
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
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
        )
        RETURNING
          id,
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
      `,
      [
        input.name,
        input.surname,
        input.status,
        input.gender,
        input.position,
        input.dateOfBirth,
        input.contractTerminationDate,
        input.email,
        input.phone,
        input.drivingLicense,
        input.drivingLicenseExpiresAt,
        input.drivingCategories,
      ]
    );

    return mapUserRow(result.rows[0]);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  }

  async listUserImagesByIds(userIds: number[]): Promise<UserImage[]> {
    const result = await this.pool.query<UserImageRow>(
      `
        SELECT id, user_id, relative_path, display_order, created_at
        FROM user_images
        WHERE user_id = ANY($1::bigint[])
        ORDER BY display_order DESC, id DESC
      `,
      [userIds]
    );

    return result.rows.map(mapUserImageRow);
  }
}
