import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class EnrollCarreraDto {
  @ApiProperty({ example: 'uuid-de-la-carrera' })
  @IsUUID(4)
  carrera_id: string;

  @ApiProperty({ example: 'uuid-de-la-malla', description: 'Malla curricular con la que ingresa el estudiante' })
  @IsUUID(4)
  malla_id: string;

  @ApiProperty({ example: 2024 })
  @IsInt()
  @Min(1990)
  anio_admision: number;
}
