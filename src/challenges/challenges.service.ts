import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UUID } from 'crypto';
import { Filters } from './types/filters.type';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge) private repo: Repository<Challenge>,
  ) {}

  async submitChallenge(dto: CreateChallengeDto, userId: UUID) {
    const challenge = this.repo.create({
      ...dto,
      submittedByUserId: userId,
      approved: false,
    });
    return this.repo.save(challenge);
  }

  async listApproved(filters: Filters, page = 1, perPage = 20) {
    const qb = this.repo
      .createQueryBuilder('chal')
      .where('chal.approved = true');

    if (
      filters.minPrice &&
      filters.maxPrice &&
      filters.minPrice > filters.maxPrice
    )
      throw new BadRequestException(
        'Min price cannot be greater than max price',
      );

    if (
      filters.minDuration &&
      filters.maxDuration &&
      filters.minDuration > filters.maxDuration
    )
      throw new BadRequestException(
        'Min duration cannot be greater than max duration',
      );

    if (filters.minPrice)
      qb.andWhere('chal.price >= :min', { min: filters.minPrice });
    if (filters.maxPrice)
      qb.andWhere('chal.price <= :max', { max: filters.maxPrice });

    if (filters.minDuration)
      qb.andWhere('chal.durationMinutes >= :minDuration', {
        minDuration: filters.minDuration,
      });
    if (filters.maxDuration)
      qb.andWhere('chal.durationMinutes <= :maxDuration', {
        maxDuration: filters.maxDuration,
      });

    if (filters.vehicles?.length)
      qb.andWhere('chal.vehicle IN (:...vehicles)', {
        vehicles: filters.vehicles,
      });

    if (filters.placeTypes?.length)
      qb.andWhere('chal.placeType IN (:...placeTypes)', {
        placeTypes: filters.placeTypes,
      });

    qb.orderBy('chal.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [items, count] = await qb.getManyAndCount();
    return { items, count, page, perPage };
  }

  async findById(id: UUID) {
    const chal = await this.repo.findOne({ where: { id } });
    if (!chal) throw new NotFoundException('Challenge not found');
    return chal;
  }

  async approve(id: UUID) {
    const chal = await this.findById(id);
    chal.approved = true;
    return this.repo.save(chal);
  }

  async delete(id: UUID) {
    const chal = await this.findById(id);
    await this.repo.remove(chal);
  }
}
