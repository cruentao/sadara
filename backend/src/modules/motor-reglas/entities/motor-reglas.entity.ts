// Represents a business rule used by the enrollment engine
export class MotorReglasEntity {
  id: string;
  nombre: string;
  tipo: string;
  valor: number;
  institucion_id: string;
  createdAt: Date;
  updatedAt: Date;
}
