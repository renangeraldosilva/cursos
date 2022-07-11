import { Component, OnInit } from '@angular/core';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent implements OnInit {
  
  cursos: Curso[] = [];

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.obterTodosOsCursos();
  }

  obterTodosOsCursos(): void {
    this.cursoService.obterTodos().subscribe((resposta) => {
      this.cursos = resposta;
    });
  }
}
