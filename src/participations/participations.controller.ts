import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ParticipationsService } from './participations.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import type { CurrentUserType } from 'src/utils/types/current-user.type';
import type { UUID } from 'crypto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('participations')
@Controller('participations')
export class ParticipationsController {
  constructor(private participationsService: ParticipationsService) {}

  @Post('start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        challengeId: { type: 'string' },
      },
      required: ['challengeId'],
    },
  })
  async start(
    @CurrentUser() user: CurrentUserType,
    @Body() body: { challengeId: UUID },
  ) {
    return this.participationsService.startChallenge(
      user.userId,
      body.challengeId,
    );
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancel(@CurrentUser() user: CurrentUserType, @Param('id') id: UUID) {
    return this.participationsService.cancelChallenge(user.userId, id);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async complete(@CurrentUser() user: CurrentUserType, @Param('id') id: UUID) {
    return this.participationsService.completeChallenge(user.userId, id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        challengeId: { type: 'string' },
      },
      required: ['challengeId', 'images'],
    },
  })
  async addImages(
    @CurrentUser() user: CurrentUserType,
    @Param('id') id: UUID,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { challengeId: UUID },
  ) {
    const images = files.map((f) => ({
      url: f.originalname,
    }));

    return this.participationsService.addCompletionImages(
      user.userId,
      id,
      body.challengeId,
      images,
    );
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async activeParticipations(@CurrentUser() user: CurrentUserType) {
    return this.participationsService.getUserActiveParticipations(user.userId);
  }

  @Get('completed/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async allCompletedCount(@CurrentUser() user: CurrentUserType) {
    return this.participationsService.getUserAllCompletedCount(user.userId);
  }

  @Get('completed/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async completedCountById(
    @CurrentUser() user: CurrentUserType,
    @Param('id') id: UUID,
  ) {
    return this.participationsService.getUserCompletedCount(user.userId, id);
  }
}
