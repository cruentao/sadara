import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoRegla } from '@prisma/client';
import { IsEnum, IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class CreateMotorReglasDto {
  @ApiProperty({ enum: TipoRegla })
  @IsEnum(TipoRegla)
  tipo_regla: TipoRegla;

  @ApiProperty({
    description: 'Configuración JSON de la regla',
    example: { max_creditos: 30 },
  })
  @IsObject()
  configuracion: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Orden de evaluación (menor = primero)', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  prioridad?: number;
}
