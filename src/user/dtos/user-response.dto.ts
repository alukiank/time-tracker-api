import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The name of the user' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @Expose()
  email: string;
}
