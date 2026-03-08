import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setCookieToken(res: Response, token: string): void {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const result = await this.authService.login(user);
    this.setCookieToken(res, result.access_token);
    return result;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, type: LoginResponseDto })
  async register(
    @Body() registerData: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.register(registerData);
    this.setCookieToken(res, result.access_token);
    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200 })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async getMe(@Request() req: AuthenticatedRequest): Promise<UserResponseDto> {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.authService.changePassword(
        req.user.userId,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
