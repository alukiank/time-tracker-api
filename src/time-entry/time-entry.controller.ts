import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateTimeEntryDto } from './dtos/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dtos/update-time-entry.dto';
import { TimeEntryOwnerGuard } from './guards/time-entry-access.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TimeEntryResponseDto } from './dtos/time-entry-response.dto';

@ApiTags('Time Entries')
@UseGuards(AuthGuard('jwt-access'))
@Controller('time-entry')
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @ApiOperation({ summary: 'Get all time entries for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved time entries.',
    type: [TimeEntryResponseDto],
  })
  @Get()
  async getAllTimeEntries(@CurrentUser('id') userId: number) {
    return this.timeEntryService.getAllTimeEntries(userId);
  }

  @ApiOperation({ summary: 'Create a new time entry for the current user' })
  @ApiResponse({
    status: 201,
    description: 'Time entry successfully created.',
    type: CreateTimeEntryDto,
  })
  @Post()
  async createTimeEntry(
    @CurrentUser() user: User,
    @Body() dto: CreateTimeEntryDto,
  ) {
    return await this.timeEntryService.createTimeEntry(user, dto);
  }

  @ApiOperation({ summary: 'Update a time entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Time entry successfully updated.',
    type: UpdateTimeEntryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Time entry not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not the owner of this time entry.',
  })
  @UseGuards(TimeEntryOwnerGuard)
  @Patch(':id')
  async updateTimeEntry(
    @Param('id', ParseIntPipe) timeEntryId: number,
    @Body() dto: UpdateTimeEntryDto,
  ) {
    return await this.timeEntryService.updateTimeEntry(timeEntryId, dto);
  }

  @ApiOperation({ summary: 'Delete a time entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Time entry successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Time entry not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not the owner of this time entry.',
  })
  @UseGuards(TimeEntryOwnerGuard)
  @Delete(':id')
  async deleteTimeEntry(@Param('id', ParseIntPipe) timeEntryId: number) {
    return await this.timeEntryService.deleteTimeEntry(timeEntryId);
  }

  @Get('reports')
  @ApiOperation({
    summary: 'Get summary of time entries grouped by project',
    description:
      'Returns a summary of time entries grouped by project for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved reports.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          projectId: { type: 'number', example: 1 },
          projectName: { type: 'string', example: 'Project A' },
          totalDuration: { type: 'string', example: '12:34:56' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getReports(@CurrentUser('id') userId: number) {
    return await this.timeEntryService.getReports(userId);
  }
}
