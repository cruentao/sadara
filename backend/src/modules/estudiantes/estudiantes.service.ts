import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EstadoEstudianteCarrera, Rol } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { EnrollCarreraDto } from './dto/enroll-carrera.dto';
import { UpdateEstudianteCarreraDto } from './dto/update-estudiante-carrera.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  findAll(institucionId: string) {
    return this.prisma.estudiante.findMany({
      where: { institucion_id: institucionId },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
  }

  async findOne(id: string, institucionId: string) {
    const estudiante = await this.prisma.estudiante.findFirst({
      where: { id, institucion_id: institucionId },
      include: {
        estudiante_carreras: {
          include: { carrera: true, malla: true },
          orderBy: { anio_admision: 'desc' },
        },
      },
    });
    if (!estudiante) throw new NotFoundException(`Estudiante '${id}' no encontrado`);
    return estudiante;
  }

  async create(dto: CreateEstudianteDto, institucionId: string) {
    const saltRounds = this.configService.get<number>('bcrypt.saltRounds') ?? 10;

    return this.prisma.$transaction(async (tx) => {
      // Validate email uniqueness across the platform
      const emailExists = await tx.cuentaUsuario.findUnique({
        where: { correo: dto.email },
      });
      if (emailExists) throw new ConflictException(`El email '${dto.email}' ya está en uso`);

      // Validate codigo_estudiante uniqueness within institution
      const codigoExists = await tx.estudiante.findFirst({
        where: { institucion_id: institucionId, codigo_estudiante: dto.codigo_estudiante },
      });
      if (codigoExists) throw new ConflictException(`El código '${dto.codigo_estudiante}' ya está en uso`);

      const contrasena_hash = await bcrypt.hash(dto.password, saltRounds);

      // Create CuentaUsuario and Estudiante atomically
      const cuenta = await tx.cuentaUsuario.create({
        data: {
          correo: dto.email,
          contrasena_hash,
          rol: Rol.estudiante,
          institucion_id: institucionId,
        },
      });

      return tx.estudiante.create({
        data: {
          cuenta_usuario_id: cuenta.id,
          institucion_id: institucionId,
          codigo_estudiante: dto.codigo_estudiante,
          nombre: dto.nombre,
          apellido: dto.apellido,
          telefono: dto.telefono,
          anio_ingreso: dto.anio_ingreso,
        },
      });
    });
  }

  async update(id: string, dto: UpdateEstudianteDto, institucionId: string) {
    await this.findOne(id, institucionId);
    return this.prisma.estudiante.update({ where: { id }, data: dto });
  }

  async remove(id: string, institucionId: string) {
    const estudiante = await this.findOne(id, institucionId);

    // Soft-delete: deactivate both Estudiante and CuentaUsuario
    await this.prisma.$transaction([
      this.prisma.estudiante.update({ where: { id }, data: { esta_activo: false } }),
      this.prisma.cuentaUsuario.update({
        where: { id: estudiante.cuenta_usuario_id },
        data: { esta_activo: false },
      }),
    ]);
  }

  // --- EstudianteCarrera ---

  async enrollCarrera(estudianteId: string, dto: EnrollCarreraDto, institucionId: string) {
    await this.findOne(estudianteId, institucionId);

    // Validate carrera belongs to institution
    const carrera = await this.prisma.carrera.findFirst({
      where: { id: dto.carrera_id, facultad: { institucion_id: institucionId } },
    });
    if (!carrera) throw new NotFoundException(`Carrera '${dto.carrera_id}' no encontrada`);

    // Validate malla belongs to that carrera
    const malla = await this.prisma.mallaCurricular.findFirst({
      where: { id: dto.malla_id, carrera_id: dto.carrera_id },
    });
    if (!malla) throw new NotFoundException(`Malla '${dto.malla_id}' no pertenece a esa carrera`);

    // Enforce one enrollment per student-carrera pair
    const enrollmentExists = await this.prisma.estudianteCarrera.findFirst({
      where: { estudiante_id: estudianteId, carrera_id: dto.carrera_id },
    });
    if (enrollmentExists) throw new ConflictException('El estudiante ya está matriculado en esa carrera');

    return this.prisma.estudianteCarrera.create({
      data: {
        estudiante_id: estudianteId,
        carrera_id: dto.carrera_id,
        malla_id: dto.malla_id,
        anio_admision: dto.anio_admision,
        estado: EstadoEstudianteCarrera.activo,
      },
    });
  }

  async updateCarreraEstado(
    estudianteId: string,
    carreraId: string,
    dto: UpdateEstudianteCarreraDto,
    institucionId: string,
  ) {
    await this.findOne(estudianteId, institucionId);

    const enrollment = await this.prisma.estudianteCarrera.findFirst({
      where: { estudiante_id: estudianteId, carrera_id: carreraId },
    });
    if (!enrollment) throw new NotFoundException('Matrícula no encontrada');

    return this.prisma.estudianteCarrera.update({
      where: { id: enrollment.id },
      data: { estado: dto.estado },
    });
  }

  async removeCarrera(estudianteId: string, carreraId: string, institucionId: string) {
    await this.findOne(estudianteId, institucionId);

    const enrollment = await this.prisma.estudianteCarrera.findFirst({
      where: { estudiante_id: estudianteId, carrera_id: carreraId },
    });
    if (!enrollment) throw new NotFoundException('Matrícula no encontrada');

    await this.prisma.estudianteCarrera.delete({ where: { id: enrollment.id } });
  }
}
