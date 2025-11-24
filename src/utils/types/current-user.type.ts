import { UUID } from 'crypto';

export type CurrentUserType = {
  userId: UUID;
  email: string;
};
