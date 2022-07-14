import { Categoria } from './../../models/categoria.model';
import { CategoriaService } from './../../services/categoria.service';
import { CursoService } from './../../services/curso.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Curso } from '../../models/curso.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  formulario: any;
  curso: Curso | undefined;
  id: any;
  categorias: Categoria[] = [];

  constructor(
    private toastr: ToastrService,
    private cursoService: CursoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriaService
  ) {
    this.formulario = new FormGroup({
      cursoId: new FormControl(0),
      descricao: new FormControl(null, Validators.required),
      dataInicio: new FormControl(null, Validators.required),
      dataTermino: new FormControl(null, Validators.required),
      categoriaId: new FormControl(null, Validators.required),
      qtdaAlunos: new FormControl(0),
      ativo: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.obterTodasAsCategorias();
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id && this.id > 0) {
        this.cursoService.obterPorId(this.id).subscribe((resultado) => {
          resultado.dataInicio = moment(resultado.dataInicio).format('YYYY-MM-DD');
          resultado.dataTermino = moment(resultado.dataTermino).format('YYYY-MM-DD');
          this.formulario.patchValue(resultado);
        });
      }
    });
  }

  enviarFormulario(): void {
    if (this.formulario.valid) {
      const curso: Curso = this.formulario.value;

      if(curso.qtdaAlunos == null) {
        curso.qtdaAlunos = 0;
      }

      if (this.id && this.id > 0) {
        curso.cursoId = this.id;

        this.cursoService.atualizar(curso).subscribe(
          () => {
            this.toastr.success('Dados atualizados.');
            this.router.navigate(['']);
          },
          (respostaError) => {
            this.toastr.error(respostaError.error);
          });
      } else {
        this.cursoService.salvar(curso).subscribe(
          (resposta) => {
            this.id = resposta.cursoId;
            this.toastr.success('Dados gravados com sucesso.');
            this.router.navigate(['']);
          },
          (respostaError) => {
            this.toastr.error(respostaError.error);
          }
        );
      }
    } else {
      this.toastr.error('Preencha todos os campos obrigatórios.');
    }
  }

  obterTodasAsCategorias(): void {
    this.categoriaService.obterTodos().subscribe((resposta) => {
      this.categorias = resposta;
    });
  }
}