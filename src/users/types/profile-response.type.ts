import { UUID } from 'crypto';

export type UserProfileResponse = {
  id: UUID;
  username: string;
  email: string;
  emailVerified: boolean;
  allowPublicImages: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
