import { ApiProperty } from '@nestjs/swagger';
import { EstadoInscripcion } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateInscripcionDto {
  @ApiProperty({ enum: EstadoInscripcion })
  @IsEnum(EstadoInscripcion)
  estado: EstadoInscripcion;
}
