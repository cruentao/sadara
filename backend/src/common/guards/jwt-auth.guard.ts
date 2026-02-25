import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Called by Passport after token validation; logs failures with [SECURITY] prefix
  handleRequest<TUser>(err: Error | null, user: TUser, _info: unknown, context: ExecutionContext): TUser {
    if (err || !user) {
      const request = context.switchToHttp().getRequest<Request>();
      const ip = request.ip ?? 'unknown';
      this.logger.warn(
        `[SECURITY] invalid_or_expired_token | ip: ${ip} | timestamp: ${new Date().toISOString()}`,
      );
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return user;
  }
}
