import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateInscripcionDto {
  @ApiProperty({ description: 'ID de la sección a inscribir', format: 'uuid' })
  @IsUUID('4')
  seccion_id: string;

  @ApiProperty({ description: 'ID de la matrícula carrera del estudiante', format: 'uuid' })
  @IsUUID('4')
  estudiante_carrera_id: string;
}
