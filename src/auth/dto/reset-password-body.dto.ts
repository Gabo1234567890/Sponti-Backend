import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordBodyDto {
  @ApiProperty({
    minLength: 8,
    description:
      'Password must contain uppercase, lowercase, number, and symbol',
    example: 'StrongPass123!',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
