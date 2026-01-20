import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';

type VehiclePayload = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'images'>;

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  listVehicles(@Query('q') search?: string): Promise<Vehicle[]> {
    return this.vehiclesService.listVehicles(search);
  }

  @Get(':vehicleId')
  getVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number): Promise<Vehicle> {
    return this.vehiclesService.getVehicle(vehicleId);
  }

  @Post()
  createVehicle(@Body() payload: VehiclePayload): Promise<Vehicle> {
    return this.vehiclesService.createVehicle(payload);
  }

  @Put(':vehicleId')
  updateVehicle(
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Body() payload: Partial<VehiclePayload>
  ): Promise<Vehicle> {
    return this.vehiclesService.updateVehicle(vehicleId, payload);
  }

  @Delete(':vehicleId')
  @HttpCode(204)
  async deleteVehicle(
    @Param('vehicleId', ParseIntPipe) vehicleId: number
  ): Promise<void> {
    await this.vehiclesService.deleteVehicle(vehicleId);
  }
}
