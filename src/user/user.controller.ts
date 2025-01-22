import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/current-user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt-access'))
@ApiTags('User Profile')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@CurrentUser('id') userId: number) {
    return this.userService.getUserWithoutPassword(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({
    description: 'Data to update user profile',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'New Name' },
        email: { type: 'string', example: 'new-email@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(userId, dto);
  }

  @Put('profile/password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({
    description: 'Data to update user password',
    required: true,
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'newPassword456' },
      },
      required: ['password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User password updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async updatePassword(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPasswordById(userId, dto);
  }
}
