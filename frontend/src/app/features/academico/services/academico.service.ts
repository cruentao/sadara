import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Asignatura {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  institucion_id: string;
}

@Injectable({ providedIn: 'root' })
export class AcademicoService {
  private readonly baseUrl = `${environment.apiUrl}/academico`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.baseUrl);
  }

  findOne(id: string): Observable<Asignatura> {
    return this.http.get<Asignatura>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Asignatura>): Observable<Asignatura> {
    return this.http.post<Asignatura>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Asignatura>): Observable<Asignatura> {
    return this.http.patch<Asignatura>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
