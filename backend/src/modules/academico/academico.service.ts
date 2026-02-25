import { Injectable } from '@nestjs/common';
import { CreateAcademicoDto } from './dto/create-academico.dto';
import { UpdateAcademicoDto } from './dto/update-academico.dto';

@Injectable()
export class AcademicoService {
  // All queries must filter by institucion_id extracted from JWT (not from body)
  findAll(_institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  findOne(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  create(_dto: CreateAcademicoDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  update(_id: string, _dto: UpdateAcademicoDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  remove(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
