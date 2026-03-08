import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @MaxLength(100, { message: 'Password must have no more than 100 characters' })
  password!: string;
}
