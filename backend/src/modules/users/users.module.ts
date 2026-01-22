import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserImagesController } from './user-images.controller';
import { UserImagesService } from './user-images.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController, UserImagesController],
  providers: [UsersRepository, UsersService, UserImagesService],
})
export class UsersModule {}
