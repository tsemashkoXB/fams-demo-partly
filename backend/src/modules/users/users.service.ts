import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import {
  UserCreateInput,
  UserUpdateInput,
  UsersRepository,
} from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  listUsers(search?: string): Promise<User[]> {
    return this.usersRepository.listUsers(search);
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.usersRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: number, input: UserUpdateInput): Promise<User> {
    const user = await this.usersRepository.updateUser(userId, input);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  createUser(input: UserCreateInput): Promise<User> {
    return this.usersRepository.createUser(input);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.usersRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.deleteUser(userId);
  }
}
