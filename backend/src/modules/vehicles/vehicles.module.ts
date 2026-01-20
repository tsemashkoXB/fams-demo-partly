import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VehicleImagesController } from './vehicle-images.controller';
import { VehicleImagesService } from './vehicle-images.service';
import { VehiclesController } from './vehicles.controller';
import { VehiclesRepository } from './vehicles.repository';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VehiclesController, VehicleImagesController],
  providers: [VehiclesService, VehiclesRepository, VehicleImagesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
