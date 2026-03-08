import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
