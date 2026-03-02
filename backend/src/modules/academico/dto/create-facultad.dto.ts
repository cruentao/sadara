import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFacultadDto {
  @ApiProperty({ example: 'Facultad de Ingeniería' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre: string;

  @ApiPropertyOptional({ example: 'ingenieria', description: 'ingenieria, salud, negocios, artes, ciencias' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;
}
