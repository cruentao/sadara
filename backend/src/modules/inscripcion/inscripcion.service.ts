import { Injectable } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';

@Injectable()
export class InscripcionService {
  // All queries filter by both institucion_id and estudiante_id from JWT
  findAllForEstudiante(_estudianteId: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  create(
    _dto: CreateInscripcionDto,
    _estudianteId: string,
    _institucionId: string,
  ): { message: string } {
    return { message: 'Not implemented' };
  }

  cancel(_id: string, _estudianteId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  update(_id: string, _dto: UpdateInscripcionDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
