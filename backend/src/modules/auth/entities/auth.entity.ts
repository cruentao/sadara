import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/decorators/roles.decorator';

class AuthUserDto {
  @ApiProperty({ example: 'uuid-del-usuario' })
  id: string;

  @ApiProperty({ example: 'admin@universidad.cl' })
  email: string;

  @ApiProperty({ enum: ['super_admin', 'admin_institucion', 'estudiante'] })
  role: UserRole;

  @ApiProperty({ example: 'uuid-de-institucion', nullable: true })
  institucion_id: string | null;
}

// Public response shape for login — never includes the refresh token
export class AuthEntity {
  @ApiProperty({ description: 'JWT access token (expira en 15m)' })
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}

// Internal type used only between service and controller
export interface LoginResult extends AuthEntity {
  refreshToken: string; // plain token — set in httpOnly cookie, never in response body
}
