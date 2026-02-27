import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoAsignatura } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateAsignaturaDto {
  @ApiProperty({ example: 'MAT101' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  codigo: string;

  @ApiProperty({ example: 'Cálculo I' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(50)
  creditos: number;

  @ApiPropertyOptional({ example: 3, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  horas_teoricas?: number;

  @ApiPropertyOptional({ example: 2, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  horas_practicas?: number;

  @ApiPropertyOptional({ enum: TipoAsignatura, default: TipoAsignatura.obligatoria })
  @IsOptional()
  @IsEnum(TipoAsignatura)
  tipo_asignatura?: TipoAsignatura;
}
