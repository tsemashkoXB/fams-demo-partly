import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './modules/database/database.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [HealthModule, DatabaseModule, VehiclesModule],
})
export class AppModule {}
