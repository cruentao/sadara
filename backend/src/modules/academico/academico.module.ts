import { Module } from '@nestjs/common';
import { AsignaturasController } from './asignaturas.controller';
import { AsignaturasService } from './asignaturas.service';
import { CarrerasController } from './carreras.controller';
import { CarrerasService } from './carreras.service';
import { FacultadesController } from './facultades.controller';
import { FacultadesService } from './facultades.service';
import { MallasController } from './mallas.controller';
import { MallasService } from './mallas.service';

@Module({
  controllers: [
    FacultadesController,
    CarrerasController,
    AsignaturasController,
    MallasController,
  ],
  providers: [
    FacultadesService,
    CarrerasService,
    AsignaturasService,
    MallasService,
  ],
})
export class AcademicoModule {}
