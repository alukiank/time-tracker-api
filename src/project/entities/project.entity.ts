import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@Entity('projects')
export class Project {
  @ApiProperty({ description: 'Unique identifier of the project' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the project', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Client associated with the project',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  client: string;

  @ApiProperty({ description: 'User who owns the project' })
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ApiProperty({
    description: 'Date when the project was created',
    readOnly: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the project was last updated',
    readOnly: true,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
