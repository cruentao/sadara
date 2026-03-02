import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Carrera } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Injectable()
export class CarrerasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(institucionId: string): Promise<Carrera[]> {
    // Reach through facultad to filter by institution
    return this.prisma.carrera.findMany({
      where: { facultad: { institucion_id: institucionId } },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string, institucionId: string): Promise<Carrera> {
    const carrera = await this.prisma.carrera.findFirst({
      where: { id, facultad: { institucion_id: institucionId } },
    });
    if (!carrera) throw new NotFoundException(`Carrera '${id}' no encontrada`);
    return carrera;
  }

  async create(dto: CreateCarreraDto, institucionId: string): Promise<Carrera> {
    // Validate that facultad belongs to this institution
    const facultad = await this.prisma.facultad.findFirst({
      where: { id: dto.facultad_id, institucion_id: institucionId },
    });
    if (!facultad) throw new NotFoundException(`Facultad '${dto.facultad_id}' no encontrada o no pertenece a su institución`);

    // Enforce unique codigo within facultad
    const exists = await this.prisma.carrera.findFirst({
      where: { facultad_id: dto.facultad_id, codigo: dto.codigo },
    });
    if (exists) throw new ConflictException(`Ya existe una carrera con código '${dto.codigo}' en esa facultad`);

    return this.prisma.carrera.create({ data: dto });
  }

  async update(id: string, dto: UpdateCarreraDto, institucionId: string): Promise<Carrera> {
    await this.findOne(id, institucionId);
    return this.prisma.carrera.update({ where: { id }, data: dto });
  }

  async remove(id: string, institucionId: string): Promise<void> {
    await this.findOne(id, institucionId);
    await this.prisma.carrera.delete({ where: { id } });
  }
}
