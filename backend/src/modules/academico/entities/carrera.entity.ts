import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Modalidad } from '@prisma/client';

export class CarreraEntity {
  @ApiProperty() id: string;
  @ApiProperty() facultad_id: string;
  @ApiProperty() codigo: string;
  @ApiProperty() nombre: string;
  @ApiProperty({ enum: Modalidad }) modalidad: Modalidad;
  @ApiProperty() total_semestres: number;
  @ApiPropertyOptional({ nullable: true }) total_creditos: number | null;
  @ApiProperty() esta_activa: boolean;
}
