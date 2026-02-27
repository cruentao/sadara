import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MallaEntity {
  @ApiProperty() id: string;
  @ApiProperty() carrera_id: string;
  @ApiProperty() anio: number;
  @ApiPropertyOptional({ nullable: true }) version: string | null;
  @ApiProperty() esta_activa: boolean;
  @ApiProperty() creado_en: Date;
}
