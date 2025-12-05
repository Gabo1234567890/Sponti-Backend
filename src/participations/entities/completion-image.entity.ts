import type { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('completion-image')
export class CompletionImage {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  userId: UUID;

  @Column()
  challengeId: UUID;

  @Column()
  url: string;

  @Column({ type: 'timestamptz' })
  uploadedAt: Date;
}
