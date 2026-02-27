import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MallaCurricular, MallaAsignatura, Prerrequisito } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AddAsignaturaMallaDto } from './dto/add-asignatura-malla.dto';
import { AddPrerrequisoDto } from './dto/add-prerrequisito.dto';
import { CreateMallaDto } from './dto/create-malla.dto';
import { UpdateMallaDto } from './dto/update-malla.dto';

@Injectable()
export class MallasService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByCarrera(carreraId: string, institucionId: string): Promise<MallaCurricular[]> {
    return this.prisma.mallaCurricular.findMany({
      where: {
        carrera_id: carreraId,
        carrera: { facultad: { institucion_id: institucionId } },
      },
      orderBy: [{ anio: 'desc' }, { version: 'asc' }],
    });
  }

  async findOne(id: string, institucionId: string) {
    const malla = await this.prisma.mallaCurricular.findFirst({
      where: { id, carrera: { facultad: { institucion_id: institucionId } } },
      include: {
        malla_asignaturas: {
          include: { asignatura: true, prerrequisitos: { include: { asignatura_requerida: true } } },
          orderBy: { numero_semestre: 'asc' },
        },
      },
    });
    if (!malla) throw new NotFoundException(`Malla '${id}' no encontrada`);
    return malla;
  }

  async create(dto: CreateMallaDto, institucionId: string): Promise<MallaCurricular> {
    // Validate carrera belongs to institution
    const carrera = await this.prisma.carrera.findFirst({
      where: { id: dto.carrera_id, facultad: { institucion_id: institucionId } },
    });
    if (!carrera) throw new NotFoundException(`Carrera '${dto.carrera_id}' no encontrada o no pertenece a su institución`);

    // Enforce unique anio+version per carrera
    const exists = await this.prisma.mallaCurricular.findFirst({
      where: { carrera_id: dto.carrera_id, anio: dto.anio, version: dto.version ?? null },
    });
    if (exists) throw new ConflictException(`Ya existe una malla para esa carrera con año ${dto.anio} y versión '${dto.version ?? 'sin versión'}'`);

    return this.prisma.mallaCurricular.create({ data: dto });
  }

  async update(id: string, dto: UpdateMallaDto, institucionId: string): Promise<MallaCurricular> {
    await this.findOne(id, institucionId);
    return this.prisma.mallaCurricular.update({ where: { id }, data: dto });
  }

  async addAsignatura(mallaId: string, dto: AddAsignaturaMallaDto, institucionId: string): Promise<MallaAsignatura> {
    const malla = await this.findOne(mallaId, institucionId);

    // Validate asignatura belongs to the same institution
    const asignatura = await this.prisma.asignatura.findFirst({
      where: { id: dto.asignatura_id, institucion_id: institucionId },
    });
    if (!asignatura) throw new NotFoundException(`Asignatura '${dto.asignatura_id}' no encontrada o no pertenece a su institución`);

    // Enforce no duplicates in the same malla
    const duplicate = await this.prisma.mallaAsignatura.findFirst({
      where: { malla_id: malla.id, asignatura_id: dto.asignatura_id },
    });
    if (duplicate) throw new ConflictException('La asignatura ya está en esta malla');

    return this.prisma.mallaAsignatura.create({
      data: {
        malla_id: mallaId,
        asignatura_id: dto.asignatura_id,
        numero_semestre: dto.numero_semestre,
        es_obligatoria: dto.es_obligatoria ?? true,
      },
    });
  }

  async removeAsignatura(mallaId: string, asignaturaId: string, institucionId: string): Promise<void> {
    await this.findOne(mallaId, institucionId);

    const entry = await this.prisma.mallaAsignatura.findFirst({
      where: { malla_id: mallaId, asignatura_id: asignaturaId },
    });
    if (!entry) throw new NotFoundException('La asignatura no está en esta malla');

    await this.prisma.mallaAsignatura.delete({ where: { id: entry.id } });
  }

  async addPrerrequisito(dto: AddPrerrequisoDto, institucionId: string): Promise<Prerrequisito> {
    // Validate malla_asignatura belongs to institution
    const mallaAsignatura = await this.prisma.mallaAsignatura.findFirst({
      where: {
        id: dto.malla_asignatura_id,
        malla: { carrera: { facultad: { institucion_id: institucionId } } },
      },
    });
    if (!mallaAsignatura) throw new NotFoundException(`MallaAsignatura '${dto.malla_asignatura_id}' no encontrada`);

    // Validate asignatura_requerida belongs to institution
    const asignaturaRequerida = await this.prisma.asignatura.findFirst({
      where: { id: dto.asignatura_requerida_id, institucion_id: institucionId },
    });
    if (!asignaturaRequerida) throw new NotFoundException(`Asignatura requerida '${dto.asignatura_requerida_id}' no encontrada`);

    return this.prisma.prerrequisito.create({ data: dto });
  }

  async removePrerrequisito(id: string, institucionId: string): Promise<void> {
    const prereq = await this.prisma.prerrequisito.findFirst({
      where: {
        id,
        malla_asignatura: { malla: { carrera: { facultad: { institucion_id: institucionId } } } },
      },
    });
    if (!prereq) throw new NotFoundException(`Prerrequisito '${id}' no encontrado`);
    await this.prisma.prerrequisito.delete({ where: { id } });
  }
}
