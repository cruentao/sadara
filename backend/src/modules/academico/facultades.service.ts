import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Facultad } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@Injectable()
export class FacultadesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(institucionId: string): Promise<Facultad[]> {
    return this.prisma.facultad.findMany({
      where: { institucion_id: institucionId },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string, institucionId: string): Promise<Facultad> {
    const facultad = await this.prisma.facultad.findFirst({
      where: { id, institucion_id: institucionId },
    });
    if (!facultad) throw new NotFoundException(`Facultad '${id}' no encontrada`);
    return facultad;
  }

  async create(dto: CreateFacultadDto, institucionId: string): Promise<Facultad> {
    // Enforce unique name per institution
    const exists = await this.prisma.facultad.findFirst({
      where: { institucion_id: institucionId, nombre: dto.nombre },
    });
    if (exists) throw new ConflictException(`Ya existe una facultad con el nombre '${dto.nombre}'`);

    return this.prisma.facultad.create({
      data: { ...dto, institucion_id: institucionId },
    });
  }

  async update(id: string, dto: UpdateFacultadDto, institucionId: string): Promise<Facultad> {
    await this.findOne(id, institucionId);
    return this.prisma.facultad.update({ where: { id }, data: dto });
  }

  async remove(id: string, institucionId: string): Promise<void> {
    await this.findOne(id, institucionId);
    await this.prisma.facultad.delete({ where: { id } });
  }
}
