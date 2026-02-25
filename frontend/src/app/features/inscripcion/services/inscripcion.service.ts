import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Inscripcion {
  id: string;
  estudiante_id: string;
  asignatura_id: string;
  institucion_id: string;
  estado: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private readonly baseUrl = `${environment.apiUrl}/inscripciones`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.baseUrl);
  }

  create(asignaturaId: string): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.baseUrl, { asignatura_id: asignaturaId });
  }

  cancel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
