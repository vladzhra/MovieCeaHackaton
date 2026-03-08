import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findOneWithPassword(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return this.usersService.mapToDto(user);
    }
    return null;
  }

  async login(user: UserResponseDto): Promise<LoginResponseDto> {
    const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: CreateUserDto): Promise<LoginResponseDto> {
    // The UsersService will throw ConflictException if email already exists
    const userDto = await this.usersService.create(data);
    return this.login(userDto);
  }

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<UserResponseDto> {
    return this.usersService.changePassword(userId, oldPassword, newPassword);
  }
}
