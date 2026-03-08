import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: true, description: 'Is user an admin', required: false })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
