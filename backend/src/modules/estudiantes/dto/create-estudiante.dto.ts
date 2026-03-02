import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateEstudianteDto {
  // --- CuentaUsuario fields ---
  @ApiProperty({ example: 'juan.perez@universidad.cl' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @ApiProperty({ example: 'Contraseña123', minLength: 8, description: 'Contraseña inicial — el estudiante debe cambiarla' })
  @IsString()
  @MinLength(8)
  password: string;

  // --- Estudiante fields ---
  @ApiProperty({ example: '2024-001', description: 'Código o número de matrícula interno' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  codigo_estudiante: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellido: string;

  @ApiPropertyOptional({ example: '+56912345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsInt()
  @Min(1990)
  anio_ingreso?: number;
}
