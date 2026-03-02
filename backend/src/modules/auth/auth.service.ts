import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity, LoginResult } from './entities/auth.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, ip: string): Promise<LoginResult> {
    // Find user by email
    const user = await this.prisma.cuentaUsuario.findUnique({
      where: { correo: dto.email },
    });

    // User not found or inactive — same error message to avoid user enumeration
    if (!user || !user.esta_activo) {
      this.logger.warn(
        `[SECURITY] failed_login | correo: ${dto.email} | ip: ${ip} | timestamp: ${new Date().toISOString()}`,
      );
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verify password against bcrypt hash
    const passwordValid = await bcrypt.compare(dto.password, user.contrasena_hash);
    if (!passwordValid) {
      this.logger.warn(
        `[SECURITY] failed_login | userId: ${user.id} | ip: ${ip} | timestamp: ${new Date().toISOString()}`,
      );
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Update last login timestamp
    await this.prisma.cuentaUsuario.update({
      where: { id: user.id },
      data: { ultimo_login: new Date() },
    });

    // Build JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      role: user.rol as UserRole,
      institucion_id: user.institucion_id ?? '',
    };

    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token and store its hash in DB
    // SHA-256 allows deterministic lookup without bcrypt's O(n) scan
    const plainRefreshToken = this.generateSecureToken();
    const tokenHash = this.hashToken(plainRefreshToken);
    const expiration = this.parseExpiration(
      this.configService.get<string>('jwt.refreshExpiration') ?? '7d',
    );

    await this.prisma.refreshToken.create({
      data: {
        cuenta_usuario_id: user.id,
        token: tokenHash,
        expira_en: expiration,
      },
    });

    return {
      accessToken,
      refreshToken: plainRefreshToken, // controller sets this in httpOnly cookie
      user: {
        id: user.id,
        email: user.correo,
        role: user.rol as UserRole,
        institucion_id: user.institucion_id,
      },
    };
  }

  async refresh(
    plainRefreshToken: string,
    ip: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!plainRefreshToken) {
      this.logger.warn(
        `[SECURITY] missing_refresh_token | ip: ${ip} | timestamp: ${new Date().toISOString()}`,
      );
      throw new UnauthorizedException('Refresh token no proporcionado');
    }

    const hash = this.hashToken(plainRefreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: hash },
      include: { cuenta_usuario: true },
    });

    // Validate token: must exist, not revoked, not expired, user must be active
    if (
      !stored ||
      stored.revocado ||
      stored.expira_en < new Date() ||
      !stored.cuenta_usuario.esta_activo
    ) {
      this.logger.warn(
        `[SECURITY] invalid_or_expired_token | ip: ${ip} | timestamp: ${new Date().toISOString()}`,
      );
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    // Revoke the used token — each refresh token is single-use (rotation)
    await this.prisma.refreshToken.update({
      where: { token: hash },
      data: { revocado: true },
    });

    const user = stored.cuenta_usuario;
    const payload: JwtPayload = {
      sub: user.id,
      role: user.rol as UserRole,
      institucion_id: user.institucion_id ?? '',
    };

    // Issue a new refresh token and persist its hash
    const newPlainRefreshToken = this.generateSecureToken();
    const newTokenHash = this.hashToken(newPlainRefreshToken);
    const expiration = this.parseExpiration(
      this.configService.get<string>('jwt.refreshExpiration') ?? '7d',
    );

    await this.prisma.refreshToken.create({
      data: {
        cuenta_usuario_id: user.id,
        token: newTokenHash,
        expira_en: expiration,
      },
    });

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: newPlainRefreshToken,
    };
  }

  async logout(userId: string, plainRefreshToken: string | undefined): Promise<void> {
    if (!plainRefreshToken) return;

    const hash = this.hashToken(plainRefreshToken);

    // Revoke only this session's token — other sessions remain active
    await this.prisma.refreshToken.updateMany({
      where: { token: hash, cuenta_usuario_id: userId, revocado: false },
      data: { revocado: true },
    });
  }

  // Builds the public response shape (without the refresh token)
  buildPublicResponse(result: LoginResult): AuthEntity {
    return { accessToken: result.accessToken, user: result.user };
  }

  // Generates a cryptographically secure random token (128 hex chars)
  private generateSecureToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  // SHA-256 hash for deterministic DB lookup without timing-safe comparison issues
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Parses NestJS JWT duration strings (15m, 7d) into a future Date
  private parseExpiration(duration: string): Date {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);
    const msPerUnit: Record<string, number> = {
      s: 1_000,
      m: 60 * 1_000,
      h: 60 * 60 * 1_000,
      d: 24 * 60 * 60 * 1_000,
    };
    return new Date(Date.now() + value * (msPerUnit[unit] ?? msPerUnit['d']));
  }
}
