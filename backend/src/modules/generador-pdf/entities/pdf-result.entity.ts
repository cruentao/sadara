// Represents the result of a PDF generation request
export class PdfResultEntity {
  id: string;
  tipo: string;
  url: string;
  generadoEn: Date;
  usuarioId: string;
  institucion_id: string;
}
