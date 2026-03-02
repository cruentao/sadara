import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoInstitucion } from '@prisma/client';

export class InstitucionEntity {
  @ApiProperty({ example: 'uuid-de-la-institucion' })
  id: string;

  @ApiProperty({ example: 'Universidad de Santiago de Chile' })
  nombre: string;

  @ApiProperty({ example: 'usach' })
  slug: string;

  @ApiProperty({ enum: TipoInstitucion })
  tipo: TipoInstitucion;

  @ApiPropertyOptional({ example: 'https://storage.azure.com/logos/usach.png', nullable: true })
  logo_url: string | null;

  @ApiProperty()
  creado_en: Date;

  @ApiPropertyOptional({ nullable: true })
  actualizado_en: Date | null;
}
