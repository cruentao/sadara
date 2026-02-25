import { Injectable } from '@nestjs/common';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';

@Injectable()
export class InstitucionService {
  // Business logic will be implemented in a dedicated step
  findAll(): { message: string } {
    return { message: 'Not implemented' };
  }

  findOne(_id: string): { message: string } {
    return { message: 'Not implemented' };
  }

  create(_dto: CreateInstitucionDto): { message: string } {
    return { message: 'Not implemented' };
  }

  update(_id: string, _dto: UpdateInstitucionDto): { message: string } {
    return { message: 'Not implemented' };
  }

  remove(_id: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
