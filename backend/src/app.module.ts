import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [HealthModule, DatabaseModule, VehiclesModule, UsersModule, BookingsModule],
})
export class AppModule {}
