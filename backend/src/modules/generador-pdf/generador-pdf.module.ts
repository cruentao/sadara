import { Module } from '@nestjs/common';
import { GeneradorPdfController } from './generador-pdf.controller';
import { GeneradorPdfService } from './generador-pdf.service';

@Module({
  controllers: [GeneradorPdfController],
  providers: [GeneradorPdfService],
  exports: [GeneradorPdfService],
})
export class GeneradorPdfModule {}
