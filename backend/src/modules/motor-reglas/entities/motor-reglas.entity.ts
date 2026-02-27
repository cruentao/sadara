import { ApiProperty } from '@nestjs/swagger';
import { TipoRegla } from '@prisma/client';

export class ReglaInstitucionEntity {
  @ApiProperty() id: string;
  @ApiProperty() institucion_id: string;
  @ApiProperty({ enum: TipoRegla }) tipo_regla: TipoRegla;
  @ApiProperty({ description: 'Configuración JSON de la regla' }) configuracion: object;
  @ApiProperty() prioridad: number;
  @ApiProperty() esta_habilitada: boolean;
}
