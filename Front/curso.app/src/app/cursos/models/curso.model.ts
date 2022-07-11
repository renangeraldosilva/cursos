export class Curso {
    cursoId: number = 0;
    descricao: string = '';
    dataInicio: string = '';
    dataTermino: string = '';
    qtdaAlunos: number = 0;
    ativo: boolean = true ;
    categoriaId: number = 0;
    categorias!: {
        id: number;
        tipo: string;
    };
}
