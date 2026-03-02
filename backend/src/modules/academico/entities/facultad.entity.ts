import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FacultadEntity {
  @ApiProperty() id: string;
  @ApiProperty() institucion_id: string;
  @ApiProperty() nombre: string;
  @ApiPropertyOptional({ nullable: true }) area: string | null;
}
