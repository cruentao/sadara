import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateInstitucionDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre?: string;

  @IsOptional()
  @IsUrl({}, { message: 'El dominio debe ser una URL válida' })
  dominio?: string;
}
