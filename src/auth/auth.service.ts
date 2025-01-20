import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UserService } from 'src/user/user.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup({ name, email, password }: SignupDto, res: Response) {
    const createdUser = await this.userService.createUser({
      name,
      email,
      password,
    });
    return await this.generateTokens(createdUser.id, res);
  }

  async login(userId: number, res: Response) {
    return await this.generateTokens(userId, res);
  }

  async me(userId: number) {
    return await this.userService.getUserWithoutPassword(userId);
  }

  async validateUser(email: string, password: string) {
    const userByEmail = await this.userService.getUserByEmail({ email });
    if (!userByEmail) {
      return null;
    }
    const isValidPassword = await verify(userByEmail.hashedPassword, password);
    if (!isValidPassword) {
      return null;
    }
    return userByEmail;
  }

  async generateTokens(userId: number, res: Response) {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES'),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
      },
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.getCookieMaxAge(
        this.configService.get<string>('JWT_ACCESS_EXPIRES'),
      ),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.getCookieMaxAge(
        this.configService.get<string>('JWT_REFRESH_EXPIRES'),
      ),
    });

    return { accessToken, refreshToken };
  }

  private getCookieMaxAge(expiry: string): number {
    switch (true) {
      case expiry.endsWith('s'):
        return parseInt(expiry) * 1000;
      case expiry.endsWith('m'):
        return parseInt(expiry) * 60 * 1000;
      case expiry.endsWith('h'):
        return parseInt(expiry) * 60 * 60 * 1000;
      case expiry.endsWith('d'):
        return parseInt(expiry) * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }
}
