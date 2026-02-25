import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rut: string;
  institucion_id: string;
}

@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private readonly baseUrl = `${environment.apiUrl}/estudiantes`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.baseUrl);
  }

  findOne(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.patch<Estudiante>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
