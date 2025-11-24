import { UUID } from 'crypto';

export type JwtPayloadUser = {
  userId: UUID;
  email: string;
};
