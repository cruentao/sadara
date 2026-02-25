import { UserRole } from '../../../common/decorators/roles.decorator';

// Represents the authentication response returned to the client
export class AuthEntity {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    institucion_id: string | null;
  };
}
