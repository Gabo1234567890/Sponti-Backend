import type { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type Vehicle = 'car' | 'walking' | 'plane' | 'train' | 'bicycle';
export type PlaceType = 'indoor' | 'outdoor' | 'anywhere';

@Entity('challenges')
export class challenges {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ length: 25 })
  title: string;

  @Column({ length: 500 })
  description: string;

  @Column({ nullable: true })
  tumbnailUrl: string;

  @Column({ default: 0 })
  price: number;

  @Column({ type: 'varchar', length: 5, comment: 'hh:mm' })
  duration: string;

  @Column({ length: 20 })
  place: string;

  @Column({ type: 'varchar', length: 10 })
  vehicle: Vehicle;

  @Column({ type: 'varchar', length: 10 })
  placeType: PlaceType;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  submittedByUserId: UUID;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
