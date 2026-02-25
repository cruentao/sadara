import { Module } from '@nestjs/common';
import { InstitucionController } from './institucion.controller';
import { InstitucionService } from './institucion.service';

@Module({
  controllers: [InstitucionController],
  providers: [InstitucionService],
  exports: [InstitucionService],
})
export class InstitucionModule {}
