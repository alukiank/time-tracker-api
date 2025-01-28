import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/project/entities/project.entity';

export class TimeEntryResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the time entry',
  })
  id: number;

  @ApiProperty({
    example: 'Worked on the feature',
    description: 'Description of the work performed',
  })
  description: string;

  @ApiProperty({
    example: '2025-01-20',
    description: 'Date of the time entry',
  })
  date: Date;

  @ApiProperty({
    example: '02:30:00',
    description: 'Duration of the work in hh:mm:ss format',
  })
  duration: string;

  @ApiProperty({
    example: '2025-01-19T12:34:56Z',
    description: 'Timestamp when the time entry was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-20T15:23:45Z',
    description: 'Timestamp when the time entry was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => Project,
    description: 'The project associated with this time entry',
  })
  project: Project;
}
