import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoInscripcion } from '@prisma/client';

export class InscripcionEntity {
  @ApiProperty() id: string;
  @ApiProperty() estudiante_carrera_id: string;
  @ApiProperty() seccion_id: string;
  @ApiProperty() periodo_id: string;
  @ApiProperty({ enum: EstadoInscripcion }) estado: EstadoInscripcion;
  @ApiProperty() inscrito_en: Date;
  @ApiPropertyOptional({ nullable: true }) actualizado_en: Date | null;
}
