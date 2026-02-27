import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsOptional, Min } from 'class-validator';

export class UpdatePrioridadDto {
  @ApiPropertyOptional({ description: 'Nuevo puntaje de prioridad', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  puntaje_prioridad?: number;

  @ApiPropertyOptional({ description: 'Nuevo inicio de ventana de inscripción (ISO 8601)' })
  @IsOptional()
  @IsISO8601()
  ventana_inicio?: string;

  @ApiPropertyOptional({ description: 'Nuevo fin de ventana de inscripción (ISO 8601)' })
  @IsOptional()
  @IsISO8601()
  ventana_fin?: string;
}
