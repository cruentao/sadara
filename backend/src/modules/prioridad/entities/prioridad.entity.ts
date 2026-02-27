import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrioridadInscripcionEntity {
  @ApiProperty() id: string;
  @ApiProperty() estudiante_carrera_id: string;
  @ApiProperty() periodo_id: string;
  @ApiProperty() puntaje_prioridad: number;
  @ApiPropertyOptional({ nullable: true }) ventana_inicio: Date | null;
  @ApiPropertyOptional({ nullable: true }) ventana_fin: Date | null;
}
