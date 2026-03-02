import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EstudianteEntity {
  @ApiProperty() id: string;
  @ApiProperty() cuenta_usuario_id: string;
  @ApiProperty() institucion_id: string;
  @ApiProperty() codigo_estudiante: string;
  @ApiProperty() nombre: string;
  @ApiProperty() apellido: string;
  @ApiPropertyOptional({ nullable: true }) telefono: string | null;
  @ApiPropertyOptional({ nullable: true }) anio_ingreso: number | null;
  @ApiProperty() esta_activo: boolean;
}
