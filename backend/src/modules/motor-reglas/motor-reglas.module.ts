import { Module } from '@nestjs/common';
import { MotorReglasController } from './motor-reglas.controller';
import { MotorReglasService } from './motor-reglas.service';

@Module({
  controllers: [MotorReglasController],
  providers: [MotorReglasService],
  exports: [MotorReglasService],
})
export class MotorReglasModule {}
