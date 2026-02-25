import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from './roles.decorator';

// Shape of the JWT payload injected by JwtStrategy.validate()
export interface JwtPayload {
  sub: string;
  role: UserRole;
  institucion_id: string;
}

// Extracts the authenticated user from the request object
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
