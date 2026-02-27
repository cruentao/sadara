import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Modalidad } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCarreraDto {
  @ApiProperty({ example: 'uuid-de-la-facultad' })
  @IsUUID(4)
  facultad_id: string;

  @ApiProperty({ example: 'ICI' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  codigo: string;

  @ApiProperty({ example: 'Ingeniería Civil Informática' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre: string;

  @ApiProperty({ enum: Modalidad, example: Modalidad.presencial })
  @IsEnum(Modalidad)
  modalidad: Modalidad;

  @ApiProperty({ example: 10, description: 'Total de semestres de la carrera' })
  @IsInt()
  @Min(1)
  @Max(20)
  total_semestres: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsInt()
  @Min(0)
  total_creditos?: number;
}
