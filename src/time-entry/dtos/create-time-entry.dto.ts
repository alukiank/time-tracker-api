import {
  IsDate,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimeEntryDto {
  @ApiProperty({
    description: 'Description of the time entry',
    example: 'Worked on the login feature',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ID of the project the time entry is associated with',
    example: 1,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({
    description: 'Date when the work was done',
    example: '2025-01-20',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    description: 'Duration of the work in hh:mm:ss format',
    example: '02:30:00',
  })
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Duration must be in hh:mm:ss format',
  })
  duration: string;
}
