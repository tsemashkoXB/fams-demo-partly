import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleImage } from './entities/vehicle-image.entity';

type VehicleRow = {
  id: number;
  plate_number: string;
  model_name: string;
  type: string;
  year_of_production: number;
  vin: string;
  current_mileage: number;
  color: string | null;
  engine: string | null;
  fuel_type: string | null;
  payload: string | number | null;
  seats: number | null;
  full_mass: string | number | null;
  vehicle_passport: string | null;
  vehicle_passport_issued_date: Date | string | null;
  insurance: string | null;
  insurance_expires_at: Date | string | null;
  next_service_at_mileage: number | null;
  next_service_till_date: Date | string | null;
  state_inspection_expires_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export type VehicleCreateInput = Omit<
  Vehicle,
  'id' | 'createdAt' | 'updatedAt' | 'images'
>;
export type VehicleUpdateInput = Partial<VehicleCreateInput>;

type VehicleImageRow = {
  id: number;
  vehicle_id: number;
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

function mapVehicleRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    plateNumber: row.plate_number,
    modelName: row.model_name,
    type: row.type as Vehicle['type'],
    yearOfProduction: row.year_of_production,
    vin: row.vin,
    currentMileage: row.current_mileage,
    color: row.color,
    engine: row.engine,
    fuelType: row.fuel_type as Vehicle['fuelType'],
    payload: row.payload === null ? null : Number(row.payload),
    seats: row.seats,
    fullMass: row.full_mass === null ? null : Number(row.full_mass),
    vehiclePassport: row.vehicle_passport,
    vehiclePassportIssuedDate: toNullableString(row.vehicle_passport_issued_date),
    insurance: row.insurance,
    insuranceExpiresAt: toNullableString(row.insurance_expires_at),
    nextServiceAtMileage: row.next_service_at_mileage,
    nextServiceTillDate: toNullableString(row.next_service_till_date),
    stateInspectionExpiresAt: toNullableString(row.state_inspection_expires_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

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
export class VehiclesRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async listVehicles(search?: string): Promise<Vehicle[]> {
    const values: string[] = [];
    let whereClause = '';

    if (search) {
      values.push(`%${search}%`);
      whereClause =
        'WHERE plate_number ILIKE $1 OR model_name ILIKE $1 OR type ILIKE $1 OR CAST(year_of_production AS TEXT) ILIKE $1';
    }

    const result = await this.pool.query<VehicleRow>(
      `
        SELECT
          id,
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
        FROM vehicles
        ${whereClause}
        ORDER BY id ASC
      `,
      values
    );

    const vehicles = result.rows.map(mapVehicleRow);
    if (vehicles.length === 0) {
      return vehicles;
    }

    const vehicleIds = vehicles.map((vehicle) => vehicle.id);
    const images = await this.listVehicleImagesByIds(vehicleIds);
    const imagesByVehicle = new Map<number, VehicleImage[]>();
    for (const image of images) {
      const current = imagesByVehicle.get(image.vehicleId) ?? [];
      current.push(image);
      imagesByVehicle.set(image.vehicleId, current);
    }

    return vehicles.map((vehicle) => ({
      ...vehicle,
      images: imagesByVehicle.get(vehicle.id) ?? [],
    }));
  }

  async createVehicle(input: VehicleCreateInput): Promise<Vehicle> {
    const result = await this.pool.query<VehicleRow>(
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
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19,
          NOW(), NOW()
        )
        RETURNING
          id,
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
      `,
      [
        input.plateNumber,
        input.modelName,
        input.type,
        input.yearOfProduction,
        input.vin,
        input.currentMileage,
        input.color,
        input.engine,
        input.fuelType,
        input.payload,
        input.seats,
        input.fullMass,
        input.vehiclePassport,
        input.vehiclePassportIssuedDate,
        input.insurance,
        input.insuranceExpiresAt,
        input.nextServiceAtMileage,
        input.nextServiceTillDate,
        input.stateInspectionExpiresAt,
      ]
    );

    return mapVehicleRow(result.rows[0]);
  }

  async updateVehicle(id: number, input: VehicleUpdateInput): Promise<Vehicle | null> {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];
    let index = 1;

    const addField = (column: string, value: string | number | null) => {
      fields.push(`${column} = $${index}`);
      values.push(value);
      index += 1;
    };

    if (input.plateNumber !== undefined) addField('plate_number', input.plateNumber);
    if (input.modelName !== undefined) addField('model_name', input.modelName);
    if (input.type !== undefined) addField('type', input.type);
    if (input.yearOfProduction !== undefined)
      addField('year_of_production', input.yearOfProduction);
    if (input.vin !== undefined) addField('vin', input.vin);
    if (input.currentMileage !== undefined)
      addField('current_mileage', input.currentMileage);
    if (input.color !== undefined) addField('color', input.color);
    if (input.engine !== undefined) addField('engine', input.engine);
    if (input.fuelType !== undefined) addField('fuel_type', input.fuelType);
    if (input.payload !== undefined) addField('payload', input.payload);
    if (input.seats !== undefined) addField('seats', input.seats);
    if (input.fullMass !== undefined) addField('full_mass', input.fullMass);
    if (input.vehiclePassport !== undefined)
      addField('vehicle_passport', input.vehiclePassport);
    if (input.vehiclePassportIssuedDate !== undefined)
      addField('vehicle_passport_issued_date', input.vehiclePassportIssuedDate);
    if (input.insurance !== undefined) addField('insurance', input.insurance);
    if (input.insuranceExpiresAt !== undefined)
      addField('insurance_expires_at', input.insuranceExpiresAt);
    if (input.nextServiceAtMileage !== undefined)
      addField('next_service_at_mileage', input.nextServiceAtMileage);
    if (input.nextServiceTillDate !== undefined)
      addField('next_service_till_date', input.nextServiceTillDate);
    if (input.stateInspectionExpiresAt !== undefined)
      addField('state_inspection_expires_at', input.stateInspectionExpiresAt);

    if (fields.length === 0) {
      return this.getVehicleById(id);
    }

    values.push(id);

    const result = await this.pool.query<VehicleRow>(
      `
        UPDATE vehicles
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${index}
        RETURNING
          id,
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
      `,
      values
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    const vehicle = mapVehicleRow(row);
    const images = await this.listVehicleImages(id);
    return { ...vehicle, images };
  }

  async deleteVehicle(id: number): Promise<void> {
    await this.pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  }

  async getVehicleById(id: number): Promise<Vehicle | null> {
    const result = await this.pool.query<VehicleRow>(
      `
        SELECT
          id,
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
        FROM vehicles
        WHERE id = $1
      `,
      [id]
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    const vehicle = mapVehicleRow(row);
    const images = await this.listVehicleImages(id);
    return { ...vehicle, images };
  }

  async listVehicleImages(vehicleId: number): Promise<VehicleImage[]> {
    const result = await this.pool.query<VehicleImageRow>(
      `
        SELECT
          id,
          vehicle_id,
          relative_path,
          display_order,
          created_at
        FROM vehicle_images
        WHERE vehicle_id = $1
        ORDER BY display_order ASC, id ASC
      `,
      [vehicleId]
    );

    return result.rows.map(mapVehicleImageRow);
  }

  private async listVehicleImagesByIds(
    vehicleIds: number[]
  ): Promise<VehicleImage[]> {
    const result = await this.pool.query<VehicleImageRow>(
      `
        SELECT
          id,
          vehicle_id,
          relative_path,
          display_order,
          created_at
        FROM vehicle_images
        WHERE vehicle_id = ANY($1::bigint[])
        ORDER BY vehicle_id ASC, display_order ASC, id ASC
      `,
      [vehicleIds]
    );

    return result.rows.map(mapVehicleImageRow);
  }
}
