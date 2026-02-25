import { Injectable } from '@nestjs/common';
import { CreateMotorReglasDto } from './dto/create-motor-reglas.dto';
import { UpdateMotorReglasDto } from './dto/update-motor-reglas.dto';

@Injectable()
export class MotorReglasService {
  findAll(_institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  findOne(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  create(_dto: CreateMotorReglasDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  update(_id: string, _dto: UpdateMotorReglasDto, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }

  remove(_id: string, _institucionId: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
