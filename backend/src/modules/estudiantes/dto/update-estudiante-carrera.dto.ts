import { ApiProperty } from '@nestjs/swagger';
import { EstadoEstudianteCarrera } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateEstudianteCarreraDto {
  @ApiProperty({ enum: EstadoEstudianteCarrera, example: EstadoEstudianteCarrera.egresado })
  @IsEnum(EstadoEstudianteCarrera)
  estado: EstadoEstudianteCarrera;
}
