import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({
    description: 'User credentials',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'username' },
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'securepassword123' },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Can not sign up this user.',
  })
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signup(dto, res);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({
    description: 'User credentials',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'securepassword123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiCreatedResponse({
    description: 'User logined successfully',
  })
  @ApiBadRequestResponse({
    description: "Invalid email or password or user doesn't exist",
  })
  async login(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(userId, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @ApiCreatedResponse({
    description: 'Token refreshed successfully',
  })
  @ApiBadRequestResponse({
    description: 'Something went wront. Make sure user authenticated',
  })
  async refresh(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.generateTokens(userId, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('logout')
  @ApiCreatedResponse({
    description: 'User logout success',
  })
  @ApiBadRequestResponse({
    description: 'Something went wront. Make sure user authenticated',
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', '');
    res.cookie('accessToken', '');
  }
}
