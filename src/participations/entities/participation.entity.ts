import type { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('participations')
export class Participation {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  userId: UUID;

  @Column()
  challengeId: UUID;

  @Column({ default: 'active' })
  status: 'active' | 'cancelled' | 'completed';

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ default: 0 })
  completionCount?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
