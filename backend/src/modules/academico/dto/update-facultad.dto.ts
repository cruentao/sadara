import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateFacultadDto {
  @ApiPropertyOptional({ example: 'Facultad de Ingeniería y Ciencias' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre?: string;

  @ApiPropertyOptional({ example: 'ingenieria' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;
}
