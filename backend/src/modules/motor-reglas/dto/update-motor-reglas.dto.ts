import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class UpdateMotorReglasDto {
  @ApiPropertyOptional({
    description: 'Nueva configuración JSON de la regla',
    example: { max_creditos: 24 },
  })
  @IsOptional()
  @IsObject()
  configuracion?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Nuevo orden de evaluación' })
  @IsOptional()
  @IsInt()
  @Min(0)
  prioridad?: number;

  @ApiPropertyOptional({ description: 'Habilitar o deshabilitar la regla' })
  @IsOptional()
  @IsBoolean()
  esta_habilitada?: boolean;
}
