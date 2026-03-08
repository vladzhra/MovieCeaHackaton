import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  isAdmin!: boolean;

  @ApiProperty()
  createdAt!: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.isAdmin = user.isAdmin;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
