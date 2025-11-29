import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participation } from './entities/participation.entity';
import { Repository } from 'typeorm';
import { CompletionImage } from './entities/completion-image.entity';
import { UUID } from 'crypto';

const MAX_ACTIVE_CHALLENGES = 5;
const MAX_IMAGES_ON_COMPLETION = 5;

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(Participation)
    private participationRepo: Repository<Participation>,
    @InjectRepository(CompletionImage)
    private imgRepo: Repository<CompletionImage>,
  ) {}

  async startChallenge(userId: UUID, challengeId: UUID) {
    const activeCount = await this.participationRepo.count({
      where: { userId, status: 'active' },
    });

    if (activeCount >= MAX_ACTIVE_CHALLENGES)
      throw new BadRequestException(
        `Max ${MAX_ACTIVE_CHALLENGES} active challenges allowed`,
      );

    const existing = await this.participationRepo.findOne({
      where: { userId, challengeId, status: 'active' },
    });
    if (existing) throw new BadRequestException('Challenge already active');

    const p = this.participationRepo.create({
      userId,
      challengeId,
      status: 'active',
      startedAt: new Date(),
    });

    return this.participationRepo.save(p);
  }

  async cancelChallenge(userId: UUID, participationId: UUID) {
    const p = await this.participationRepo.findOne({
      where: { id: participationId, userId },
    });

    if (!p) throw new NotFoundException('Participation not found');
    if (p.status !== 'active')
      throw new BadRequestException('Cannot cancel non-active challenge');

    p.status = 'inactive';
    return this.participationRepo.save(p);
  }

  async completeChallenge(userId: UUID, participationId: UUID) {
    const p = await this.participationRepo.findOne({
      where: { id: participationId, userId },
    });

    if (!p) throw new NotFoundException('Participation not found');
    if (p.status !== 'active')
      throw new BadRequestException('Cannot complete non-active challenge');

    p.status = 'completed';
    p.completedAt = new Date();
    p.completionCount = (p.completionCount || 0) + 1;

    return this.participationRepo.save(p);
  }

  async addCompletionImages(
    userId: UUID,
    participationId: UUID,
    challengeId: UUID,
    images: { url: string }[],
  ) {
    const currentCount = await this.imgRepo.count({
      where: { participationId },
    });
    if (currentCount + images.length > MAX_IMAGES_ON_COMPLETION)
      throw new BadRequestException('Image cap exceeded');

    const entities = images.map((img) =>
      this.imgRepo.create({
        participationId,
        userId,
        challengeId,
        url: img.url,
        uploadedAt: new Date(),
      }),
    );

    return this.imgRepo.save(entities);
  }

  async getUserActiveParticipations(userId: UUID) {
    return this.participationRepo.find({ where: { userId, status: 'active' } });
  }

  async getUserAllCompletedCount(userId: UUID) {
    return this.participationRepo.count({
      where: { userId, status: 'completed' },
    });
  }

  async getUserCompletedCount(userId: UUID, participationId: UUID) {
    const p = await this.participationRepo.findOne({
      where: { userId, id: participationId },
    });
    if (!p) throw new NotFoundException('Participation not found');

    return p.completionCount;
  }
}
