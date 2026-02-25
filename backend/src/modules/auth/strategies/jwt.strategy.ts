import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extract Bearer token from Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret') ?? '',
    });
  }

  // Called after signature is verified; return value is injected as request.user
  validate(payload: JwtPayload): JwtPayload {
    return {
      sub: payload.sub,
      role: payload.role,
      institucion_id: payload.institucion_id,
    };
  }
}
