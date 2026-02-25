// Represents an enrollment (inscripción) returned by the API
export class InscripcionEntity {
  id: string;
  estudiante_id: string;
  asignatura_id: string;
  institucion_id: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}
