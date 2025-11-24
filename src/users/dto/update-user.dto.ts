import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'NewUser' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: "If true user's images could be used in challenge details",
  })
  @IsOptional()
  @IsBoolean()
  allowPublicImages?: boolean;
}
