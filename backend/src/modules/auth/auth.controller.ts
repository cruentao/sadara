import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';

// Refresh token cookie configuration
const REFRESH_COOKIE = 'refresh_token';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario', description: 'Valida credenciales y retorna un access token JWT. El refresh token se establece como cookie httpOnly.' })
  @ApiResponse({ status: 200, description: 'Login exitoso', type: AuthEntity })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthEntity> {
    const result = await this.authService.login(loginDto, req.ip ?? '');

    // Set refresh token in httpOnly cookie — never exposed in response body
    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_COOKIE_MAX_AGE,
      path: '/auth',
    });

    return this.authService.buildPublicResponse(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: 'Renovar access token', description: 'Usa el refresh token de la cookie httpOnly para emitir un nuevo access token.' })
  @ApiResponse({ status: 200, description: 'Nuevo access token', schema: { properties: { accessToken: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refresh(
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const refreshToken = (req.cookies as Record<string, string>)[REFRESH_COOKIE] ?? '';
    return this.authService.refresh(refreshToken, req.ip ?? '');
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cerrar sesión', description: 'Revoca el refresh token de la sesión actual. El access token expirará por su propio TTL.' })
  @ApiResponse({ status: 204, description: 'Sesión cerrada correctamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = (req.cookies as Record<string, string>)[REFRESH_COOKIE];
    await this.authService.logout(user.sub, refreshToken);

    // Clear the cookie on the client
    res.clearCookie(REFRESH_COOKIE, { path: '/auth' });
  }
}
