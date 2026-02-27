import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMotorReglasDto } from './dto/create-motor-reglas.dto';
import { UpdateMotorReglasDto } from './dto/update-motor-reglas.dto';

@Injectable()
export class MotorReglasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(institucionId: string) {
    return this.prisma.reglaInstitucion.findMany({
      where: { institucion_id: institucionId },
      orderBy: [{ prioridad: 'asc' }, { tipo_regla: 'asc' }],
    });
  }

  async findOne(id: string, institucionId: string) {
    const regla = await this.prisma.reglaInstitucion.findFirst({
      where: { id, institucion_id: institucionId },
    });
    if (!regla) throw new NotFoundException(`Regla '${id}' no encontrada`);
    return regla;
  }

  async create(dto: CreateMotorReglasDto, institucionId: string) {
    return this.prisma.reglaInstitucion.create({
      data: {
        institucion_id: institucionId,
        tipo_regla: dto.tipo_regla,
        // Cast required: Prisma JSON fields expect InputJsonValue, not plain Record
        configuracion: dto.configuracion as Prisma.InputJsonValue,
        prioridad: dto.prioridad ?? 0,
      },
    });
  }

  async update(id: string, dto: UpdateMotorReglasDto, institucionId: string) {
    // Validates ownership before updating
    await this.findOne(id, institucionId);
    return this.prisma.reglaInstitucion.update({
      where: { id },
      data: {
        ...(dto.prioridad !== undefined && { prioridad: dto.prioridad }),
        ...(dto.esta_habilitada !== undefined && { esta_habilitada: dto.esta_habilitada }),
        // Cast required: Prisma JSON fields expect InputJsonValue, not plain Record
        ...(dto.configuracion !== undefined && {
          configuracion: dto.configuracion as Prisma.InputJsonValue,
        }),
      },
    });
  }

  async remove(id: string, institucionId: string) {
    // Validates ownership before deleting
    await this.findOne(id, institucionId);
    return this.prisma.reglaInstitucion.delete({ where: { id } });
  }
}
