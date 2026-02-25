import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateAcademicoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  codigo: string;

  @IsInt()
  @Min(1)
  @Max(50)
  creditos: number;
}
