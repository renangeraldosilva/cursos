import { Categoria } from './../models/categoria.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  url = 'https://localhost:5001/api/Categoria';

  constructor(private http: HttpClient) {}
  
  obterTodos(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }
}
