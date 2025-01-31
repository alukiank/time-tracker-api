import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { Repository } from 'typeorm';
import { CreateTimeEntryDto } from './dtos/create-time-entry.dto';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateTimeEntryDto } from './dtos/update-time-entry.dto';
import { durationToSeconds, secondsToDuration } from 'src/utils/time.utils';
import { groupBy } from 'lodash';

@Injectable()
export class TimeEntryService {
  constructor(
    @InjectRepository(TimeEntry)
    private readonly timeEntryRepository: Repository<TimeEntry>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  async getAllTimeEntries(userId: number) {
    const timeEntries = await this.timeEntryRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });
    return timeEntries;
  }

  async getTimeEntryById(timeEntryId: number) {
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id: timeEntryId },
      relations: ['project', 'user'],
    });
    if (!timeEntry) {
      throw new NotFoundException();
    }
    return timeEntry;
  }

  async createTimeEntry(
    user: User,
    { description, projectId, date, duration }: CreateTimeEntryDto,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: user.id } },
    });
    if (!project) {
      throw new NotFoundException();
    }
    const timeEntry = this.timeEntryRepository.create({
      description,
      date,
      duration,
      project,
      user,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    await this.timeEntryRepository.save(timeEntry);
  }

  async updateTimeEntry(timeEntryId: number, dto: UpdateTimeEntryDto) {
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id: timeEntryId },
      relations: ['project', 'user'],
    });
    if (!timeEntry) {
      throw new NotFoundException();
    }
    Object.assign(timeEntry, dto);
    await this.timeEntryRepository.save(timeEntry);
  }

  async deleteTimeEntry(timeEntryId: number) {
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id: timeEntryId },
      relations: ['project', 'user'],
    });
    if (!timeEntry) {
      throw new NotFoundException();
    }
    await this.timeEntryRepository.remove(timeEntry);
  }

  async getReports(userId: number) {
    const timeEntries = await this.timeEntryRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });
    const groupedByProject = groupBy(timeEntries, (entry) => entry.project.id);
    return this.formatReports(groupedByProject);
  }

  private formatReports(groupedEntries: Record<number, TimeEntry[]>) {
    return Object.entries(groupedEntries).map(([projectId, entries]) => {
      const projectName = entries[0].project.name;
      const totalDurationInSeconds = entries
        .map((entry) => durationToSeconds(entry.duration))
        .reduce((total, current) => total + current, 0);
      return {
        projectId: parseInt(projectId, 10),
        projectName,
        totalDuration: secondsToDuration(totalDurationInSeconds),
      };
    });
  }
}
