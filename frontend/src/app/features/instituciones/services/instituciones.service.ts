import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Institucion } from '../models/institucion.model';

@Injectable({ providedIn: 'root' })
export class InstitucionesService {
  private readonly baseUrl = `${environment.apiUrl}/instituciones`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Institucion[]> {
    return this.http.get<Institucion[]>(this.baseUrl);
  }

  findOne(id: string): Observable<Institucion> {
    return this.http.get<Institucion>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Institucion>): Observable<Institucion> {
    return this.http.post<Institucion>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Institucion>): Observable<Institucion> {
    return this.http.patch<Institucion>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
