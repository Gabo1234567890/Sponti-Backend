import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import type { UserProfileResponse } from './types/profile-response.type';
import { CompletionImage } from 'src/participations/entities/completion-image.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  private async findById(userId: UUID) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getProfile(userId: UUID): Promise<UserProfileResponse> {
    const user = await this.findById(userId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      allowPublicImages: user.allowPublicImages,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(
    userId: UUID,
    data: { username?: string; allowPublicImages?: boolean },
  ) {
    const user = await this.findById(userId);

    if (data.username && data.username !== user.username) {
      const exists = await this.repo.findOne({
        where: { username: data.username },
      });
      if (exists) throw new BadRequestException('Username already taken');
      user.username = data.username;
    }

    if (
      data.allowPublicImages !== undefined &&
      data.allowPublicImages !== user.allowPublicImages
    ) {
      user.allowPublicImages = data.allowPublicImages;
    }

    await this.repo.save(user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      allowPublicImages: user.allowPublicImages,
    };
  }

  async deleteAccount(userId: UUID) {
    const user = await this.findById(userId);
    await this.repo.remove(user);
  }

  async getUserMemories(userId: UUID, page = 1, perPage = 10) {
    const qb = this.repo.manager
      .getRepository(CompletionImage)
      .createQueryBuilder('img')
      .innerJoin('challenges', 'chal', 'chal.id = img.challengeId')
      .where('img.userId = :userId', { userId })
      .orderBy('img.uploadedAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage)
      .select([
        'img.url AS imageUrl',
        'img.uploadedAt AS uploadedAt',
        'chal.id AS challengeId',
        'chal.title AS challengeTitle',
      ]);

    const items = await qb.getRawMany();
    return { items, page, perPage };
  }
}
