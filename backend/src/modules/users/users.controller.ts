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
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

type UserPayload = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'images'>;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  listUsers(@Query('q') search?: string): Promise<User[]> {
    return this.usersService.listUsers(search);
  }

  @Get(':userId')
  getUser(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.getUser(userId);
  }

  @Put(':userId')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() payload: Partial<UserPayload>
  ): Promise<User> {
    return this.usersService.updateUser(userId, payload);
  }

  @Post()
  createUser(@Body() payload: UserPayload): Promise<User> {
    return this.usersService.createUser(payload);
  }

  @Delete(':userId')
  @HttpCode(204)
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<void> {
    await this.usersService.deleteUser(userId);
  }
}
