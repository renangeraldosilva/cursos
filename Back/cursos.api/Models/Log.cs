using System;

namespace cursos.api
{
    public class Log
    {
        public int LogId { get; set; }
        public int CursoId { get; set; }
        public Curso Curso { get; set; }
        public string Usuario { get; set; }
        public DateTime DataInclusao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}