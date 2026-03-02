import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security headers — sets X-Content-Type-Options, X-Frame-Options, HSTS, etc.
  app.use(helmet());

  // Parse cookies for httpOnly refresh token handling
  app.use(cookieParser());

  // Global input validation — strips unknown fields and enforces DTO rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Standardize all error response shapes
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS — restrict to configured origins only
  const allowedOrigins = configService.get<string[]>('cors.allowedOrigins') ?? [];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Swagger — API documentation at /api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SADARA API')
    .setDescription(
      'Sistema de Administración de Registro de Asignaturas — API REST multi-tenant para instituciones de educación superior.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Access token JWT (expira en 15m)' },
      'access-token',
    )
    .addCookieAuth('refresh_token', {
      type: 'apiKey',
      in: 'cookie',
      description: 'Refresh token httpOnly (expira en 7d)',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = configService.get<number>('port') ?? 3000;
  await app.listen(port);
  console.log(`SADARA API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
