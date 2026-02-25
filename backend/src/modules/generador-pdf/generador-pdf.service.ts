import { Injectable } from '@nestjs/common';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

@Injectable()
export class GeneradorPdfService {
  generate(_dto: GeneratePdfDto, _userId: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
