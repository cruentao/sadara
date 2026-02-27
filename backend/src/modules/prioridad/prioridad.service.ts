import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrioridadDto } from './dto/create-prioridad.dto';
import { UpdatePrioridadDto } from './dto/update-prioridad.dto';

@Injectable()
export class PrioridadService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(institucionId: string) {
    return this.prisma.prioridadInscripcion.findMany({
      where: { periodo: { institucion_id: institucionId } },
      orderBy: [{ periodo_id: 'asc' }, { puntaje_prioridad: 'desc' }],
    });
  }

  async findOne(id: string, institucionId: string) {
    const prioridad = await this.prisma.prioridadInscripcion.findFirst({
      where: { id, periodo: { institucion_id: institucionId } },
    });
    if (!prioridad) throw new NotFoundException(`Prioridad '${id}' no encontrada`);
    return prioridad;
  }

  async create(dto: CreatePrioridadDto, institucionId: string) {
    // Validate periodo belongs to this institution
    const periodo = await this.prisma.periodoAcademico.findFirst({
      where: { id: dto.periodo_id, institucion_id: institucionId },
    });
    if (!periodo) throw new NotFoundException(`Período '${dto.periodo_id}' no encontrado`);

    // Validate estudianteCarrera belongs to a student in this institution
    const ec = await this.prisma.estudianteCarrera.findFirst({
      where: { id: dto.estudiante_carrera_id, estudiante: { institucion_id: institucionId } },
    });
    if (!ec) throw new NotFoundException(`Matrícula de carrera '${dto.estudiante_carrera_id}' no encontrada`);

    try {
      return await this.prisma.prioridadInscripcion.create({
        data: {
          estudiante_carrera_id: dto.estudiante_carrera_id,
          periodo_id: dto.periodo_id,
          puntaje_prioridad: dto.puntaje_prioridad,
          ventana_inicio: dto.ventana_inicio ? new Date(dto.ventana_inicio) : null,
          ventana_fin: dto.ventana_fin ? new Date(dto.ventana_fin) : null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ya existe una prioridad para este estudiante en este período');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdatePrioridadDto, institucionId: string) {
    // Validates institution ownership before updating
    await this.findOne(id, institucionId);
    return this.prisma.prioridadInscripcion.update({
      where: { id },
      data: {
        ...(dto.puntaje_prioridad !== undefined && { puntaje_prioridad: dto.puntaje_prioridad }),
        ...(dto.ventana_inicio !== undefined && { ventana_inicio: new Date(dto.ventana_inicio) }),
        ...(dto.ventana_fin !== undefined && { ventana_fin: new Date(dto.ventana_fin) }),
      },
    });
  }

  async remove(id: string, institucionId: string) {
    // Validates institution ownership before deleting
    await this.findOne(id, institucionId);
    return this.prisma.prioridadInscripcion.delete({ where: { id } });
  }
}
