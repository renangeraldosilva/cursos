import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent implements OnInit {
  modalOptions: NgbModalOptions = {
    size: 'md',
    centered: true,
  };

  formulario: any;
  cursos: Curso[] = [];
  cursosFiltrados: any = [];
  private _filtroLista: string = '';

  constructor(
    private cursoService: CursoService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.formulario = new FormGroup({
      cursoId: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.obterTodosOsCursos();
  }

  public get filtroLista() {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.cursosFiltrados = this.filtroLista
      ? this.filtrarCursos(this.filtroLista)
      : this.cursos;
  }

  filtrarCursos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.cursos.filter(
      (cursos: {
        descricao: string;
        dataInicio: string;
        dataTermino: string;
      }) =>
        cursos.descricao.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        cursos.dataInicio.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        cursos.dataTermino.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  obterTodosOsCursos(): void {
    this.cursoService.obterTodos().subscribe((resposta) => {
      this.cursosFiltrados = resposta;
      this.cursos = resposta;
    });
  }

  modalDeletar(htmlModal: any, id: number) {
    this.modalService
      .open(htmlModal, this.modalOptions)
      .result.then((resposta) => {
        if (resposta) {
          this.deletar(id);
        }
      });
  }

  deletar(id: number): void {
    this.cursoService.deletar(id).subscribe(
      () => {
        this.toastr.success('', 'Registro Deletado!');
        this.obterTodosOsCursos();
      },
      (error) => {
        this.toastr.error('Ocorreu um erro', 'Atenção!');
      }
    );
  }
}
