import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoInstitucion } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateInstitucionDto {
  @ApiPropertyOptional({ example: 'Universidad de Santiago de Chile' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  nombre?: string;

  @ApiPropertyOptional({ enum: TipoInstitucion })
  @IsOptional()
  @IsEnum(TipoInstitucion, { message: 'Tipo inválido. Valores permitidos: universidad, instituto_tecnico, instituto_profesional' })
  tipo?: TipoInstitucion;

  @ApiPropertyOptional({ example: 'https://storage.azure.com/logos/usach.png' })
  @IsOptional()
  @IsUrl({}, { message: 'El logo_url debe ser una URL válida' })
  logo_url?: string;
}
