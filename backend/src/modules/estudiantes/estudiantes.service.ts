import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  findAll(_institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  findOne(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  create(_dto: CreateEstudianteDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  update(_id: string, _dto: UpdateEstudianteDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  remove(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
