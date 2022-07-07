using System;

namespace cursos.api
{
    public class Curso
    {
        public int CursoId { get; set; }
        public string Descricao { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataTermino { get; set; }
        public int QtdaAlunos { get; set; }
        public Categoria Categorias { get; set; }
        public bool Ativo { get; set; }
    }
}