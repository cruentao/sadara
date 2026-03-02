import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Asignatura } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@Injectable()
export class AsignaturasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(institucionId: string): Promise<Asignatura[]> {
    return this.prisma.asignatura.findMany({
      where: { institucion_id: institucionId },
      orderBy: { codigo: 'asc' },
    });
  }

  async findOne(id: string, institucionId: string): Promise<Asignatura> {
    const asignatura = await this.prisma.asignatura.findFirst({
      where: { id, institucion_id: institucionId },
    });
    if (!asignatura) throw new NotFoundException(`Asignatura '${id}' no encontrada`);
    return asignatura;
  }

  async create(dto: CreateAsignaturaDto, institucionId: string): Promise<Asignatura> {
    // Enforce unique codigo per institution
    const exists = await this.prisma.asignatura.findFirst({
      where: { institucion_id: institucionId, codigo: dto.codigo },
    });
    if (exists) throw new ConflictException(`Ya existe una asignatura con código '${dto.codigo}'`);

    return this.prisma.asignatura.create({
      data: { ...dto, institucion_id: institucionId },
    });
  }

  async update(id: string, dto: UpdateAsignaturaDto, institucionId: string): Promise<Asignatura> {
    await this.findOne(id, institucionId);
    return this.prisma.asignatura.update({ where: { id }, data: dto });
  }

  async remove(id: string, institucionId: string): Promise<void> {
    await this.findOne(id, institucionId);
    await this.prisma.asignatura.delete({ where: { id } });
  }
}
