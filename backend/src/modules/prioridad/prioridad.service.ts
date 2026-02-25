import { Injectable } from '@nestjs/common';
import { CreatePrioridadDto } from './dto/create-prioridad.dto';
import { UpdatePrioridadDto } from './dto/update-prioridad.dto';

@Injectable()
export class PrioridadService {
  findAll(_institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  findOne(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  create(_dto: CreatePrioridadDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  update(_id: string, _dto: UpdatePrioridadDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  remove(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
