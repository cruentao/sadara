import { IsString, IsUUID } from 'class-validator';

export class CreateInscripcionDto {
  @IsString()
  @IsUUID(4, { message: 'El ID de asignatura debe ser un UUID válido' })
  asignatura_id: string;
}
