import { IsIn, IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateMotorReglasDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre: string;

  @IsString()
  @IsIn(['prerequisito', 'limite_creditos', 'incompatibilidad'])
  tipo: string;

  @IsInt()
  @Min(0)
  valor: number;
}
