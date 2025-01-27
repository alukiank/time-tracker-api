import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';

export class ProjectResponseDto {
  @ApiProperty({ description: 'The unique identifier of the project' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The name of the project' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'The client associated with the project' })
  @Expose()
  client: string;

  @ApiProperty({ description: 'The creation date of the project' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the project' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'User information (creator of the project)' })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
