import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Institucion } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';

@Injectable()
export class InstitucionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Institucion[]> {
    return this.prisma.institucion.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string): Promise<Institucion> {
    const institucion = await this.prisma.institucion.findUnique({
      where: { id },
    });

    if (!institucion) {
      throw new NotFoundException(`Institución con id '${id}' no encontrada`);
    }

    return institucion;
  }

  async create(dto: CreateInstitucionDto): Promise<Institucion> {
    // Enforce slug uniqueness with a clear error message
    const slugExists = await this.prisma.institucion.findUnique({
      where: { slug: dto.slug },
    });

    if (slugExists) {
      throw new ConflictException(`El slug '${dto.slug}' ya está en uso`);
    }

    return this.prisma.institucion.create({ data: dto });
  }

  async update(id: string, dto: UpdateInstitucionDto): Promise<Institucion> {
    // Verify existence before updating
    await this.findOne(id);

    return this.prisma.institucion.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Institucion> {
    // Verify existence before deleting
    await this.findOne(id);

    return this.prisma.institucion.delete({ where: { id } });
  }
}
