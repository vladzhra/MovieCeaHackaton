import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(+id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
