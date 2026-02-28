import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { InstitucionModule } from './modules/institucion/institucion.module';
import { AcademicoModule } from './modules/academico/academico.module';
import { InscripcionModule } from './modules/inscripcion/inscripcion.module';
import { MotorReglasModule } from './modules/motor-reglas/motor-reglas.module';
import { EstudiantesModule } from './modules/estudiantes/estudiantes.module';
import { PrioridadModule } from './modules/prioridad/prioridad.module';
import { GeneradorPdfModule } from './modules/generador-pdf/generador-pdf.module';

@Module({
  imports: [
    // Global config — available everywhere without importing ConfigModule again
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Rate limiting — applied selectively per endpoint via ThrottlerGuard decorator
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
    // Global Prisma — available everywhere without importing PrismaModule again
    PrismaModule,
    // Feature modules
    AuthModule,
    InstitucionModule,
    AcademicoModule,
    InscripcionModule,
    MotorReglasModule,
    EstudiantesModule,
    PrioridadModule,
    GeneradorPdfModule,
  ],
})
export class AppModule {}
