import { ApiPropertyOptional } from '@nestjs/swagger';
import { Modalidad } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateCarreraDto {
  @ApiPropertyOptional({ example: 'Ingeniería Civil Informática' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre?: string;

  @ApiPropertyOptional({ enum: Modalidad })
  @IsOptional()
  @IsEnum(Modalidad)
  modalidad?: Modalidad;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  total_semestres?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsInt()
  @Min(0)
  total_creditos?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  esta_activa?: boolean;
}
