import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoAsignatura } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateAsignaturaDto {
  @ApiPropertyOptional({ example: 'Cálculo I' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  creditos?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  horas_teoricas?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  horas_practicas?: number;

  @ApiPropertyOptional({ enum: TipoAsignatura })
  @IsOptional()
  @IsEnum(TipoAsignatura)
  tipo_asignatura?: TipoAsignatura;
}
