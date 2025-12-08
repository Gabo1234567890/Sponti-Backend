import type { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('participations')
export class Participation {
  @PrimaryColumn('uuid')
  userId: UUID;

  @PrimaryColumn('uuid')
  challengeId: UUID;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ default: 0 })
  completionCount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
