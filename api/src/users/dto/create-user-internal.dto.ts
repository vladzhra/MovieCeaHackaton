import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';

/**
 * Internal DTO for creating users (used by seed and admin endpoints)
 * Allows setting isAdmin flag, unlike the public CreateUserDto
 */
export class CreateUserInternalDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @MaxLength(100, { message: 'Password must have no more than 100 characters' })
  password!: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
