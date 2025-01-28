import { Module } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntry } from './entities/time-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';
import { TimeEntryOwnerGuard } from './guards/time-entry-access.guard';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry, Project])],
  controllers: [TimeEntryController],
  providers: [TimeEntryService, TimeEntryOwnerGuard],
})
export class TimeEntryModule {}
