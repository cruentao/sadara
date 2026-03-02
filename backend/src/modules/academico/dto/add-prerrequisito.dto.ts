import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class AddPrerrequisoDto {
  @ApiProperty({ example: 'uuid-de-malla-asignatura', description: 'ID de la asignatura en la malla que TIENE el prerrequisito' })
  @IsUUID(4)
  malla_asignatura_id: string;

  @ApiProperty({ example: 'uuid-de-asignatura', description: 'ID de la asignatura que SE DEBE APROBAR' })
  @IsUUID(4)
  asignatura_requerida_id: string;

  @ApiProperty({
    example: 'A',
    description: 'Mismo grupo_clave = AND entre prerrequisitos, distinto grupo_clave = OR entre grupos',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  grupo_clave: string;
}
