import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty({
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    description: 'name',
    example: 'Taras',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @ApiProperty({
    description: 'email',
    example: 'tarasik228@gmail.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  @ApiProperty({
    description: 'hashedPassword',
    example: 'awdada6doa546sfo231pasfaw1212fawfaefaefkawfk',
  })
  @Column({ type: 'varchar', length: 255 })
  hashedPassword: string;
  @ApiProperty({
    description: 'createdAt',
  })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({
    description: 'updatedAt',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
