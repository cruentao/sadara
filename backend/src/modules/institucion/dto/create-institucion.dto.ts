import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoInstitucion } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateInstitucionDto {
  @ApiProperty({ example: 'Universidad de Santiago de Chile' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre: string;

  @ApiProperty({
    example: 'usach',
    description: 'Identificador URL único (solo minúsculas, letras, números y guiones)',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, { message: 'El slug solo puede contener minúsculas, números y guiones' })
  slug: string;

  @ApiProperty({ enum: TipoInstitucion, example: TipoInstitucion.universidad })
  @IsEnum(TipoInstitucion, { message: 'Tipo inválido. Valores permitidos: universidad, instituto_tecnico, instituto_profesional' })
  tipo: TipoInstitucion;

  @ApiPropertyOptional({ example: 'https://storage.azure.com/logos/usach.png' })
  @IsOptional()
  @IsUrl({}, { message: 'El logo_url debe ser una URL válida' })
  logo_url?: string;
}
