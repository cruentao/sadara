import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoInscripcion, Prisma } from '@prisma/client';
import PDFDocument = require('pdfkit');
import { PrismaService } from '../../prisma/prisma.service';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

// Maps dia_semana int (1–6) to Spanish day name
const DIAS: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

/** Formats a Prisma Time field (returned as Date) to "HH:MM" */
function formatTime(date: Date): string {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Prisma payload types for the EstudianteCarrera query used across both generators
type EcArgs = {
  include: {
    carrera: { include: { facultad: { include: { institucion: true } } } };
    malla: { include: { malla_asignaturas: { include: { asignatura: true }; orderBy: Prisma.MallaAsignaturaOrderByWithRelationInput[] } } };
  };
};
type EstudianteCarreraConDatos = NonNullable<Prisma.EstudianteCarreraGetPayload<EcArgs>>;

@Injectable()
export class GeneradorPdfService {
  constructor(private readonly prisma: PrismaService) {}

  private async getEstudiante(cuentaUsuarioId: string, institucionId: string) {
    const estudiante = await this.prisma.estudiante.findFirst({
      where: { cuenta_usuario_id: cuentaUsuarioId, institucion_id: institucionId, esta_activo: true },
    });
    if (!estudiante) throw new NotFoundException('Perfil de estudiante no encontrado');
    return estudiante;
  }

  /** Collects pdfkit output chunks and resolves with a single Buffer */
  private buildPdfBuffer(fn: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      fn(doc);
      doc.end();
    });
  }

  async generate(dto: GeneratePdfDto, cuentaUsuarioId: string, institucionId: string): Promise<Buffer> {
    const estudiante = await this.getEstudiante(cuentaUsuarioId, institucionId);

    // Load EstudianteCarrera validating it belongs to this student
    const ec = await this.prisma.estudianteCarrera.findFirst({
      where: { id: dto.estudiante_carrera_id, estudiante_id: estudiante.id },
      include: {
        carrera: { include: { facultad: { include: { institucion: true } } } },
        malla: {
          include: {
            malla_asignaturas: {
              include: { asignatura: true },
              orderBy: [{ numero_semestre: 'asc' }, { asignatura: { nombre: 'asc' } }],
            },
          },
        },
      },
    });
    if (!ec) throw new NotFoundException('Matrícula de carrera no encontrada');

    if (dto.tipo === 'malla_curricular') {
      return this.generarMalla(ec, estudiante);
    }
    return this.generarHorario(ec, estudiante, institucionId);
  }

  /** Generates a PDF listing all subjects in the student's curriculum, grouped by semester */
  private generarMalla(
    ec: EstudianteCarreraConDatos,
    estudiante: { nombre: string; apellido: string; codigo_estudiante: string },
  ): Promise<Buffer> {
    return this.buildPdfBuffer((doc) => {
      const { institucion } = ec.carrera.facultad;
      const version = ec.malla.version ? ` — ${ec.malla.version}` : '';

      // Document header
      doc.fontSize(14).font('Helvetica-Bold').text(institucion.nombre, { align: 'center' });
      doc.fontSize(11).font('Helvetica').text(ec.carrera.nombre, { align: 'center' });
      doc.text(`Plan de estudios ${ec.malla.anio}${version}`, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(9).text(
        `Alumno: ${estudiante.nombre} ${estudiante.apellido}  |  Código: ${estudiante.codigo_estudiante}`,
        { align: 'center' },
      );
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);

      // Group asignaturas by numero_semestre
      const porSemestre = new Map<number, typeof ec.malla.malla_asignaturas>();
      for (const ma of ec.malla.malla_asignaturas) {
        if (!porSemestre.has(ma.numero_semestre)) porSemestre.set(ma.numero_semestre, []);
        porSemestre.get(ma.numero_semestre)!.push(ma);
      }

      let totalCreditos = 0;

      for (const [semestre, asignaturas] of [...porSemestre.entries()].sort((a, b) => a[0] - b[0])) {
        doc.fontSize(10).font('Helvetica-Bold').text(`Semestre ${semestre}`);
        doc.moveDown(0.3);

        // Column headers
        const y0 = doc.y;
        doc.fontSize(8).font('Helvetica-Bold');
        doc.text('Código', 50, y0, { width: 70, continued: true });
        doc.text('Asignatura', 120, y0, { width: 230, continued: true });
        doc.text('Créditos', 350, y0, { width: 60, align: 'right', continued: true });
        doc.text('Tipo', 420, y0, { width: 125 });
        doc.moveDown(0.2);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#999999').stroke().strokeColor('black');
        doc.moveDown(0.2);

        doc.font('Helvetica').fontSize(8);
        for (const ma of asignaturas) {
          const y = doc.y;
          doc.text(ma.asignatura.codigo, 50, y, { width: 70, continued: true });
          doc.text(ma.asignatura.nombre, 120, y, { width: 230, continued: true });
          doc.text(String(ma.asignatura.creditos), 350, y, { width: 60, align: 'right', continued: true });
          doc.text(ma.es_obligatoria ? 'Obligatoria' : 'Electiva', 420, y, { width: 125 });
          totalCreditos += ma.asignatura.creditos;
        }
        doc.moveDown(0.8);
      }

      // Footer
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(9).font('Helvetica-Bold').text(`Total de créditos: ${totalCreditos}`, { align: 'right' });
    });
  }

  /** Generates a PDF listing active inscriptions for the current period with their schedule blocks */
  private async generarHorario(
    ec: EstudianteCarreraConDatos,
    estudiante: { nombre: string; apellido: string; codigo_estudiante: string },
    institucionId: string,
  ): Promise<Buffer> {
    const inscripciones = await this.prisma.inscripcion.findMany({
      where: {
        estudiante_carrera_id: ec.id,
        estado: { not: EstadoInscripcion.retirado },
        periodo: { institucion_id: institucionId, esta_activo: true },
      },
      include: {
        seccion: {
          include: {
            asignatura: true,
            bloques_horario: { orderBy: [{ dia_semana: 'asc' }, { hora_inicio: 'asc' }] },
          },
        },
        periodo: true,
      },
      orderBy: { seccion: { asignatura: { nombre: 'asc' } } },
    });

    if (inscripciones.length === 0) {
      throw new NotFoundException('No hay inscripciones activas en el período actual');
    }

    const { institucion } = ec.carrera.facultad;
    const periodo = inscripciones[0].periodo;

    return this.buildPdfBuffer((doc) => {
      // Document header
      doc.fontSize(14).font('Helvetica-Bold').text(institucion.nombre, { align: 'center' });
      doc.fontSize(11).font('Helvetica').text('Horario de Inscripciones', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(9).text(
        `Alumno: ${estudiante.nombre} ${estudiante.apellido}  |  Código: ${estudiante.codigo_estudiante}`,
        { align: 'center' },
      );
      doc.text(`Carrera: ${ec.carrera.nombre}  |  Período: ${periodo.nombre}`, { align: 'center' });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);

      let totalCreditos = 0;

      for (const ins of inscripciones) {
        const { seccion } = ins;

        doc.fontSize(10).font('Helvetica-Bold').text(
          `${seccion.asignatura.nombre} (${seccion.asignatura.codigo}) — Sección ${seccion.codigo}`,
        );
        doc.fontSize(8).font('Helvetica').text(`Créditos: ${seccion.asignatura.creditos}`);
        doc.moveDown(0.3);

        if (seccion.bloques_horario.length === 0) {
          doc.fontSize(8).font('Helvetica-Oblique').text('  Sin bloques horarios registrados');
        } else {
          for (const bloque of seccion.bloques_horario) {
            const dia = DIAS[bloque.dia_semana] ?? `Día ${bloque.dia_semana}`;
            const sala = bloque.sala ? `  —  Sala: ${bloque.sala}` : '';
            doc.fontSize(8).font('Helvetica').text(
              `  ${dia}  ${formatTime(bloque.hora_inicio)} – ${formatTime(bloque.hora_fin)}${sala}`,
            );
          }
        }

        totalCreditos += seccion.asignatura.creditos;
        doc.moveDown(0.7);
      }

      // Footer
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.3);
      doc.fontSize(9).font('Helvetica-Bold').text(
        `Total de créditos inscritos: ${totalCreditos}`,
        { align: 'right' },
      );
    });
  }
}
