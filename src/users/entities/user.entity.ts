import type { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  emailVerificationToken?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerificationExpires?: Date | null;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'text', name: 'refresh_token', nullable: true })
  hashedRefreshToken?: string | null;

  @Column({ type: 'text', nullable: true })
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  resetPasswordExpires?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
