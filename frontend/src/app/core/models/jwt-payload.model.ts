import { UserRole } from './user.model';

// Shape of the decoded JWT payload
export interface JwtPayload {
  sub: string;
  role: UserRole;
  institucion_id: string;
  iat: number;
  exp: number;
}
