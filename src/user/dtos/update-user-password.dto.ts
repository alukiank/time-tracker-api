import { IsDefined, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
