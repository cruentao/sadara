import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';

export class GeneratePdfDto {
  @ApiProperty({
    enum: ['malla_curricular', 'horario_inscripciones'],
    description:
      'malla_curricular: plan de estudios completo de la carrera. ' +
      'horario_inscripciones: asignaturas inscritas en el período activo con sus bloques horarios.',
  })
  @IsIn(['malla_curricular', 'horario_inscripciones'])
  tipo: 'malla_curricular' | 'horario_inscripciones';

  @ApiProperty({ description: 'ID de la matrícula de carrera del estudiante', format: 'uuid' })
  @IsUUID('4')
  estudiante_carrera_id: string;
}
