// Represents a priority score assigned to a student for enrollment ordering
export class PrioridadEntity {
  id: string;
  estudiante_id: string;
  puntaje: number;
  motivo: string;
  institucion_id: string;
  createdAt: Date;
  updatedAt: Date;
}
