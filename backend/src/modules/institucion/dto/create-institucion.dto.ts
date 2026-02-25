import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateInstitucionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  codigo: string;

  @IsUrl({}, { message: 'El dominio debe ser una URL válida' })
  dominio: string;
}
