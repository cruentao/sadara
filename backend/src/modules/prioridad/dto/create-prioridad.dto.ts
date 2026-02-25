import { IsInt, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePrioridadDto {
  @IsString()
  @IsUUID(4)
  estudiante_id: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  puntaje: number;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  motivo: string;
}
