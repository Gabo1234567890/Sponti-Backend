import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import type { CurrentUserType } from 'src/utils/types/current-user.type';
import type { UUID } from 'crypto';
import { ListChallengesQueryDto } from './dto/list-challenges-query.dto';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { PlaceType, Vehicle } from './entities/challenge.entity';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('tumbnail', {
      storage: diskStorage({
        destination: './uploads/tumbnails',
        filename: (_req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          cb(null, v4() + '.' + ext);
        },
      }),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tumbnail: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        durationMinutes: { type: 'number' },
        place: { type: 'string' },
        vehicle: { type: 'string', enum: Object.values(Vehicle) },
        placeType: { type: 'string', enum: Object.values(PlaceType) },
      },
    },
  })
  async submit(
    @UploadedFile() tumbnail: Express.Multer.File,
    @Body() dto: CreateChallengeDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.challengesService.submitChallenge(dto, user.userId, tumbnail);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async list(@Query() query: ListChallengesQueryDto) {
    return this.challengesService.listApproved(
      query,
      query.page,
      query.perPage,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async get(@Param('id') id: UUID) {
    return this.challengesService.findById(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  async approve(@Param('id') id: UUID) {
    return this.challengesService.approve(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  async delete(@Param('id') id: UUID) {
    return this.challengesService.delete(id);
  }
}
