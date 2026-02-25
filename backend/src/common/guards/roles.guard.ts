import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from '../decorators/current-user.decorator';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read roles metadata from the handler or controller
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no @Roles() decorator, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      const ip = request.ip ?? 'unknown';
      this.logger.warn(
        `[SECURITY] unauthorized_role_access | userId: ${user?.sub ?? 'unknown'} | institucionId: ${user?.institucion_id ?? 'unknown'} | ip: ${ip} | timestamp: ${new Date().toISOString()}`,
      );
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    return true;
  }
}
