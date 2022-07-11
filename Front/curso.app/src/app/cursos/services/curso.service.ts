import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Curso } from '../models/curso.model';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  url = 'https://localhost:5001/api/Curso';

  constructor(private http: HttpClient) {}

  obterTodos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.url);
  }

  obterPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.url}/${id}`);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  salvar(curso: Curso): Observable<any> {
    return this.http.post<Curso>(this.url, curso, httpOptions);
  }

  atualizar(curso: Curso): Observable<any> {
    return this.http.put<Curso>(`${this.url}/${curso.cursoId}`, curso, httpOptions);
  }
}
