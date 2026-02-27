import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class CreateMallaDto {
  @ApiProperty({ example: 'uuid-de-la-carrera' })
  @IsUUID(4)
  carrera_id: string;

  @ApiProperty({ example: 2024, description: 'Año de vigencia de la malla' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  anio: number;

  @ApiPropertyOptional({ example: 'v1', description: 'Versión dentro del mismo año' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  version?: string;
}
