import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, Matches } from 'class-validator';

export class UpdateTimeEntryDto {
  @ApiPropertyOptional({
    example: 'Updated description of work',
    description: 'New description of the work performed',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '2025-01-25',
    description: 'New date for the time entry',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    example: '03:30:00',
    description: 'New duration of the work in hh:mm:ss format',
  })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Duration must be in hh:mm:ss format',
  })
  duration?: string;
}
