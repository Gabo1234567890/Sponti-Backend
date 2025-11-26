import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
  IsIn,
} from 'class-validator';
import type { PlaceType, Vehicle } from '../entities/challenge.entity';

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
  thumbnailUrl?: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  @Max(999)
  price: number;

  @ApiProperty({ description: 'Time duration in minutes' })
  @IsInt()
  durationMinutes: number;

  @ApiProperty({ example: 'park', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  place: string;

  @ApiProperty({ enum: ['car', 'walking', 'plane', 'train', 'bicycle'] })
  @IsIn(['car', 'walking', 'plane', 'train', 'bicycle'])
  vehicle: Vehicle;

  @ApiProperty({ enum: ['indoor', 'outdoor', 'anywhere'] })
  @IsIn(['indoor', 'outdoor', 'anywhere'])
  placeType: PlaceType;
}
