import type { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('completion-image')
export class CompletionImage {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ type: 'uuid' })
  userId: UUID;

  @Column({ type: 'uuid' })
  challengeId: UUID;

  @Column()
  url: string;

  @Column({ type: 'timestamptz' })
  uploadedAt: Date;
}
