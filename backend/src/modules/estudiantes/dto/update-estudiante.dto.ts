import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateEstudianteDto {
  @ApiPropertyOptional({ example: 'Juan Carlos' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Pérez González' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellido?: string;

  @ApiPropertyOptional({ example: '+56987654321' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsInt()
  @Min(1990)
  anio_ingreso?: number;
}
