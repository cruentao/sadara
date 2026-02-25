import { IsIn, IsString, IsUUID } from 'class-validator';

export class GeneratePdfDto {
  @IsString()
  @IsIn(['comprobante_inscripcion', 'listado_asignaturas'])
  tipo: string;

  @IsString()
  @IsUUID(4)
  referencia_id: string;
}
