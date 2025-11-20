import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: UUID) {
    return this.repo.findOne({ where: { id } });
  }

  async create(email: string, hashedPassword: string) {
    const user = this.repo.create({ email, password: hashedPassword });
    return this.repo.save(user);
  }
}
