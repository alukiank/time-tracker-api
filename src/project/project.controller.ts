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
import { ProjectService } from './project.service';

import { CurrentUser } from 'src/utils/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { ProjectOwnerGuard } from './guards/project-access.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt-access'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get all projects of the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of all projects for the current user',
    type: [ProjectResponseDto],
  })
  @Get()
  async getAllProjects(
    @CurrentUser('id', ParseIntPipe) userId: number,
  ): Promise<ProjectResponseDto[]> {
    return this.projectService.getAllProjects(userId);
  }

  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({
    status: 200,
    description: 'The project details',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access: user is not the project owner',
  })
  @UseGuards(ProjectOwnerGuard)
  @Get(':id')
  async getProjectById(
    @Param('id', ParseIntPipe) projectId: number,
  ): Promise<ProjectResponseDto> {
    return this.projectService.getProjectById(projectId);
  }

  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'Project successfully created',
    type: ProjectResponseDto,
  })
  @Post()
  async create(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Body() dto: CreateProjectDto,
  ) {
    return await this.projectService.create(userId, dto);
  }

  @ApiOperation({ summary: 'Update project by ID' })
  @ApiResponse({
    status: 200,
    description: 'The project has been updated',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access: user is not the project owner',
  })
  @UseGuards(ProjectOwnerGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return await this.projectService.updateById(projectId, dto);
  }

  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiResponse({
    status: 204,
    description: 'The project has been deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access: user is not the project owner',
  })
  @UseGuards(ProjectOwnerGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) projectId: number): Promise<void> {
    return await this.projectService.deleteById(projectId);
  }
}
