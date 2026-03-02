import { ApiProperty } from '@nestjs/swagger';
import { TipoAsignatura } from '@prisma/client';

export class AsignaturaEntity {
  @ApiProperty() id: string;
  @ApiProperty() institucion_id: string;
  @ApiProperty() codigo: string;
  @ApiProperty() nombre: string;
  @ApiProperty() creditos: number;
  @ApiProperty() horas_teoricas: number;
  @ApiProperty() horas_practicas: number;
  @ApiProperty({ enum: TipoAsignatura }) tipo_asignatura: TipoAsignatura;
}
