import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('time_entries')
export class TimeEntry {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the time entry',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Worked on feature',
    description: 'Description of the work performed',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    type: () => Project,
    description: 'The project associated with this time entry',
  })
  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ApiProperty({
    type: () => User,
    description: 'The user associated with this time entry',
  })
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: '2025-01-20', description: 'Date of the time entry' })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({
    example: '02:30:00',
    description: 'Duration of the work in hh:mm:ss format',
  })
  @Column({ type: 'time' })
  duration: string;

  @ApiProperty({
    example: '2025-01-19T12:34:56Z',
    description: 'Timestamp when the time entry was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-20T15:23:45Z',
    description: 'Timestamp when the time entry was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
