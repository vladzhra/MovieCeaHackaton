import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserInternalDto } from './dto/create-user-internal.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  mapToDto(user: User): UserResponseDto {
    return UserResponseDto.fromEntity(user);
  }

  async create(data: CreateUserDto | CreateUserInternalDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const isAdmin = data instanceof CreateUserInternalDto ? data.isAdmin ?? false : false;
    const user = this.usersRepository.create({
      email: data.email,
      password: hashedPassword,
      isAdmin,
    });
    const saved = await this.usersRepository.save(user);
    return this.mapToDto(saved);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map((user: User) => this.mapToDto(user));
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByIdWithPassword(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneById(id: number): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return null;
    return this.mapToDto(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    // Check if user exists BEFORE attempting update
    const exists = await this.usersRepository.exists({ where: { id } });
    if (!exists) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Only allow updating isAdmin field (admins only)
    const updateData: any = {};
    if (data.isAdmin !== undefined) {
      updateData.isAdmin = data.isAdmin;
    }

    await this.usersRepository.update(id, updateData);
    const updated = await this.findOneById(id);
    return updated!;
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<UserResponseDto> {
    // Get user with password field
    const user = await this.findOneByIdWithPassword(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });

    const updated = await this.findOneById(userId);
    if (!updated) throw new Error('User not found after password change');
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Internal helper for auth
  async findOneWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
