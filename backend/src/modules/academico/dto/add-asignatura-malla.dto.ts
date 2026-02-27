import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class AddAsignaturaMallaDto {
  @ApiProperty({ example: 'uuid-de-la-asignatura' })
  @IsUUID(4)
  asignatura_id: string;

  @ApiProperty({ example: 3, description: 'Semestre de la malla en que se ubica la asignatura' })
  @IsInt()
  @Min(1)
  @Max(20)
  numero_semestre: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  es_obligatoria?: boolean;
}
