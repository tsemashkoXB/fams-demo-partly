import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from './entities/vehicle.entity';
import {
  VehicleCreateInput,
  VehicleUpdateInput,
  VehiclesRepository,
} from './vehicles.repository';

@Injectable()
export class VehiclesService {
  constructor(private readonly vehiclesRepository: VehiclesRepository) {}

  listVehicles(search?: string): Promise<Vehicle[]> {
    return this.vehiclesRepository.listVehicles(search);
  }

  createVehicle(input: VehicleCreateInput): Promise<Vehicle> {
    return this.vehiclesRepository.createVehicle(input);
  }

  async getVehicle(id: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.getVehicleById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async updateVehicle(id: number, input: VehicleUpdateInput): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.updateVehicle(id, input);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    await this.vehiclesRepository.deleteVehicle(id);
  }
}
