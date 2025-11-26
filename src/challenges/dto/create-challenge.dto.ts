import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
  Matches,
  IsIn,
} from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({ maxLength: 25 })
  @IsString()
  @MaxLength(25)
  title: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tumbnailUrl?: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  @Max(999)
  price: number;

  @ApiProperty({ example: '01:30' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'duration must be HH:MM' })
  duration: string;

  @ApiProperty({ example: 'park', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  place: string;

  @ApiProperty({ enum: ['car', 'walking', 'plane', 'train', 'bicycle'] })
  @IsIn(['car', 'walking', 'plane', 'train', 'bicycle'])
  vehicle: string;

  @ApiProperty({ enum: ['indoor', 'outdoor', 'anywhere'] })
  @IsIn(['indoor', 'outdoor', 'anywhere'])
  placeType: string;
}
