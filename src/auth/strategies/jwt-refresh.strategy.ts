import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayLoad } from 'src/utils/types/jwt-payload';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies['refreshToken'];
      },
      IgnoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate({ userId }: JwtPayLoad) {
    const user = await this.userService.getUser({ id: userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
