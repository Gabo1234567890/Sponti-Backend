import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participation } from './entities/participation.entity';
import { CompletionImage } from './entities/completion-image.entity';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation]),
    TypeOrmModule.forFeature([CompletionImage]),
  ],
  providers: [ParticipationsService],
  controllers: [ParticipationsController],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}
