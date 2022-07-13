import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
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
  descricao: string = '';
  dataInicio: string = '';
  dataTermino: string = '';

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

  obterTodosOsCursos(): void {
    this.cursoService.obterTodos().subscribe((resposta) => {
      if(resposta != null && resposta.length > 0){
        resposta.forEach(item => {
          item.dataInicio = moment(item.dataInicio).format('YYYY-MM-DD');
          item.dataTermino = moment(item.dataTermino).format('YYYY-MM-DD');
        })
      }
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
        this.toastr.success('Registro Deletado!');
        this.obterTodosOsCursos();
      },
      (error) => {
        this.toastr.error('Ocorreu um erro', 'Atenção!');
      }
    );
  }

  limparBusca(): void {
    this.descricao = '';
    this.dataInicio = '';
    this.dataTermino = '';
  }

  filtrarPorDescricaoDataInicioDataTermino(): void {
    let dataInicio = new Date(this.dataInicio);
    let dataTermino = new Date(this.dataTermino);

    this.cursosFiltrados = this.cursos.filter(x => x.descricao.toLocaleLowerCase().indexOf(this.descricao.toLocaleLowerCase()) !== -1 && new Date(x.dataInicio) >= dataInicio && new Date(x.dataTermino) <= dataTermino);
  }

  filtrarPorDataInicioDataTermino(): void {
    let dataInicio = new Date(this.dataInicio);
    let dataTermino = new Date(this.dataTermino);

    this.cursosFiltrados = this.cursos.filter(x => new Date(x.dataInicio) >= dataInicio && new Date(x.dataTermino) <= dataTermino);
  }

  filtrarPorDescricaoDataInicio(): void {
    let dataInicio = new Date(this.dataInicio);

    this.cursosFiltrados = this.cursos.filter(x => x.descricao.toLocaleLowerCase().indexOf( this.descricao.toLocaleLowerCase()) !== -1 && new Date(x.dataInicio) >= dataInicio);
  }

  filtrarPorDescricaoDataTermino(): void {
    let dataTermino = new Date(this.dataTermino);

    this.cursosFiltrados = this.cursos.filter(x => x.descricao.toLocaleLowerCase().indexOf(this.descricao.toLocaleLowerCase()) !== -1 && new Date(x.dataTermino) <= dataTermino);
  }

  filtrarPorDataInicio(): void {
    let dataInicio = new Date(this.dataInicio);

    this.cursosFiltrados = this.cursos.filter(x => new Date(x.dataInicio) >= dataInicio);
  }

  filtrarPorDescricao(): void {
    this.cursosFiltrados = this.cursos.filter(x => x.descricao.toLocaleLowerCase().indexOf(this.descricao.toLocaleLowerCase()) !== -1);
  }

  filtrarPorTermino(): void {
    let dataTermino = new Date(this.dataTermino);

    this.cursosFiltrados = this.cursos.filter(x => new Date(x.dataTermino) <= dataTermino);
  }

  filtrarLista(): void {

    if(this.descricao != '' && this.dataInicio != '' && this.dataTermino != '') {
      this.filtrarPorDescricaoDataInicioDataTermino();
    }

    else if(this.descricao == '' && this.dataInicio != '' && this.dataTermino != '') {
      this.filtrarPorDataInicioDataTermino();
    }

    else if(this.descricao != '' && this.dataInicio != '' && this.dataTermino == '') {
      this.filtrarPorDescricaoDataInicio();
    }

    else if(this.descricao != '' && this.dataInicio == '' && this.dataTermino != '') {
      this.filtrarPorDescricaoDataTermino();
    }

    else if(this.descricao == '' && this.dataInicio != '' && this.dataTermino == '') {
      this.filtrarPorDataInicio();
    }

    else if(this.descricao != '' && this.dataInicio == '' && this.dataTermino == '') {
      this.filtrarPorDescricao();
    }

    else if(this.descricao == '' && this.dataInicio == '' && this.dataTermino != '') {
      this.filtrarPorTermino();
    } 

    else if(this.descricao == '' && this.dataInicio == '' && this.dataTermino == '') {
      this.cursosFiltrados = this.cursos;
    } 
  }

}

