import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;

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
