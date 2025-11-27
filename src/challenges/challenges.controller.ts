import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import type { CurrentUserType } from 'src/utils/types/current-user.type';
import type { UUID } from 'crypto';
import { ListChallengesQueryDto } from './dto/list-challenges-query.dto';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async submit(
    @Body() dto: CreateChallengeDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.challengesService.submitChallenge(dto, user.userId);
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async approve(@Param('id') id: UUID) {
    return this.challengesService.approve(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(@Param('id') id: UUID) {
    return this.challengesService.delete(id);
  }
}
