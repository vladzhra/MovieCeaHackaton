import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentpassword123', description: 'Current password for verification' })
  @IsString()
  @MinLength(1)
  oldPassword!: string;

  @ApiProperty({ example: 'newpassword456', description: 'New password' })
  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @MaxLength(100, { message: 'Password must have no more than 100 characters' })
  newPassword!: string;
}
