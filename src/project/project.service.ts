import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private userService: UserService,
  ) {}

  async getAllProjects(userId): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!projects || projects.length === 0) {
      throw new NotFoundException('No projects found');
    }
    const plainProjects = instanceToPlain(projects);
    return plainProjects.map((project) =>
      plainToInstance(ProjectResponseDto, project, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getProjectById(projectId: number): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['user'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return plainToInstance(ProjectResponseDto, instanceToPlain(project), {
      excludeExtraneousValues: true,
    });
  }

  async create(
    userId: number,
    { name, client }: CreateProjectDto,
  ): Promise<void> {
    const user = await this.userService.getUserById({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    const project = this.projectRepository.create({
      name,
      client,
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.projectRepository.save(project);
  }

  async updateById(projectId: number, { name, client }: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException();
    }
    await this.projectRepository.update(projectId, {
      name,
      client,
      updatedAt: new Date(),
    });
  }

  async deleteById(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
