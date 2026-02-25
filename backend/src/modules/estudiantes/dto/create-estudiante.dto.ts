import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellido: string;

  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  rut: string;
}
