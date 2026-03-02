import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsOptional, IsUUID, Min } from 'class-validator';

export class CreatePrioridadDto {
  @ApiProperty({ description: 'ID de la matrícula de carrera del estudiante', format: 'uuid' })
  @IsUUID('4')
  estudiante_carrera_id: string;

  @ApiProperty({ description: 'ID del período académico', format: 'uuid' })
  @IsUUID('4')
  periodo_id: string;

  @ApiProperty({ description: 'Puntaje de prioridad (mayor = inscribe antes)', minimum: 0 })
  @IsInt()
  @Min(0)
  puntaje_prioridad: number;

  @ApiPropertyOptional({ description: 'Inicio de la ventana de inscripción del estudiante (ISO 8601)' })
  @IsOptional()
  @IsISO8601()
  ventana_inicio?: string;

  @ApiPropertyOptional({ description: 'Fin de la ventana de inscripción del estudiante (ISO 8601)' })
  @IsOptional()
  @IsISO8601()
  ventana_fin?: string;
}
