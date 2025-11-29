import type { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Vehicle {
  CAR = 'car',
  WALKING = 'walking',
  PLANE = 'plane',
  TRAIN = 'train',
  BICYCLE = 'bicycle',
}

export enum PlaceType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  ANYWHERE = 'anywhere',
}

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ length: 25 })
  title: string;

  @Column({ length: 500 })
  description: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  price: number;

  @Column()
  durationMinutes: number;

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
