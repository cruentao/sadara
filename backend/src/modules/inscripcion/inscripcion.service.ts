import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoInscripcion } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Injectable()
export class InscripcionService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Helpers ---

  /** Resolves the active Estudiante for a given CuentaUsuario within the institution */
  private async getEstudiante(cuentaUsuarioId: string, institucionId: string) {
    const estudiante = await this.prisma.estudiante.findFirst({
      where: { cuenta_usuario_id: cuentaUsuarioId, institucion_id: institucionId, esta_activo: true },
    });
    if (!estudiante) throw new NotFoundException('Perfil de estudiante no encontrado');
    return estudiante;
  }

  /** Validates that the enrollment period is open for inscription actions */
  private validateVentana(periodo: { esta_activo: boolean; inicio_inscripcion: Date | null; fin_inscripcion: Date | null }) {
    if (!periodo.esta_activo) {
      throw new ConflictException('El período académico no está activo');
    }
    const ahora = new Date();
    if (periodo.inicio_inscripcion && ahora < periodo.inicio_inscripcion) {
      throw new ConflictException('La ventana de inscripción aún no ha comenzado');
    }
    if (periodo.fin_inscripcion && ahora > periodo.fin_inscripcion) {
      throw new ConflictException('La ventana de inscripción ha cerrado');
    }
  }

  // --- Public API ---

  async findAll(cuentaUsuarioId: string, institucionId: string) {
    const estudiante = await this.getEstudiante(cuentaUsuarioId, institucionId);
    return this.prisma.inscripcion.findMany({
      where: { estudiante_carrera: { estudiante_id: estudiante.id } },
      include: {
        seccion: { include: { asignatura: true } },
        periodo: true,
      },
      orderBy: { inscrito_en: 'desc' },
    });
  }

  async findOne(id: string, cuentaUsuarioId: string, institucionId: string) {
    const estudiante = await this.getEstudiante(cuentaUsuarioId, institucionId);
    const inscripcion = await this.prisma.inscripcion.findFirst({
      where: { id, estudiante_carrera: { estudiante_id: estudiante.id } },
      include: {
        seccion: { include: { asignatura: true, bloques_horario: true } },
        periodo: true,
      },
    });
    if (!inscripcion) throw new NotFoundException(`Inscripción '${id}' no encontrada`);
    return inscripcion;
  }

  async create(dto: CreateInscripcionDto, cuentaUsuarioId: string, institucionId: string) {
    const estudiante = await this.getEstudiante(cuentaUsuarioId, institucionId);

    // Validate EstudianteCarrera belongs to this student
    const ec = await this.prisma.estudianteCarrera.findFirst({
      where: { id: dto.estudiante_carrera_id, estudiante_id: estudiante.id },
    });
    if (!ec) throw new NotFoundException('Matrícula de carrera no encontrada');

    // Validate Seccion belongs to this institution (via periodo → institucion)
    const seccion = await this.prisma.seccion.findFirst({
      where: { id: dto.seccion_id, periodo: { institucion_id: institucionId } },
      include: { periodo: true },
    });
    if (!seccion) throw new NotFoundException('Sección no encontrada');

    // Validate enrollment window
    this.validateVentana(seccion.periodo);

    // Validate section capacity against active inscriptions
    const ocupados = await this.prisma.inscripcion.count({
      where: { seccion_id: dto.seccion_id, estado: { not: EstadoInscripcion.retirado } },
    });
    if (ocupados >= seccion.capacidad_maxima) {
      throw new ConflictException('La sección no tiene cupos disponibles');
    }

    // Check for existing inscription (including withdrawn ones)
    const existing = await this.prisma.inscripcion.findFirst({
      where: { estudiante_carrera_id: dto.estudiante_carrera_id, seccion_id: dto.seccion_id },
    });
    if (existing) {
      if (existing.estado === EstadoInscripcion.retirado) {
        throw new ConflictException(
          'Ya te retiraste de esta sección. Contacta a administración para reinscribirte.',
        );
      }
      throw new ConflictException('Ya estás inscrito en esta sección');
    }

    return this.prisma.inscripcion.create({
      data: {
        estudiante_carrera_id: dto.estudiante_carrera_id,
        seccion_id: dto.seccion_id,
        periodo_id: seccion.periodo_id,
      },
      include: {
        seccion: { include: { asignatura: true } },
        periodo: true,
      },
    });
  }

  /** Soft-withdraws an inscription by setting estado = retirado */
  async remove(id: string, cuentaUsuarioId: string, institucionId: string) {
    const estudiante = await this.getEstudiante(cuentaUsuarioId, institucionId);

    const inscripcion = await this.prisma.inscripcion.findFirst({
      where: { id, estudiante_carrera: { estudiante_id: estudiante.id } },
      include: { periodo: true },
    });
    if (!inscripcion) throw new NotFoundException(`Inscripción '${id}' no encontrada`);

    if (inscripcion.estado === EstadoInscripcion.retirado) {
      throw new ConflictException('La inscripción ya fue retirada');
    }

    // Withdrawal is only allowed during an open enrollment window
    this.validateVentana(inscripcion.periodo);

    return this.prisma.inscripcion.update({
      where: { id },
      data: { estado: EstadoInscripcion.retirado },
      include: {
        seccion: { include: { asignatura: true } },
        periodo: true,
      },
    });
  }
}
