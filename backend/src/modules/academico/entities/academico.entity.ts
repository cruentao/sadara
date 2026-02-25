// Represents an academic subject (asignatura) returned by the API
export class AcademicoEntity {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  institucion_id: string;
  createdAt: Date;
  updatedAt: Date;
}
