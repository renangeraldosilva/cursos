using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using cursos.api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace cursos.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CursoController : Controller
    {
        private readonly DataContext _context;

        public CursoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Curso>> Get()
        {
            return await _context.curso.Where(curso => curso.Ativo == true).Include(x => x.Categorias).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<Curso> GetById(int id)
        {
            return await _context.curso.Where(curso => curso.CursoId == id && curso.Ativo == true).Include(x => x.Categorias).FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Curso>> PostCurso(Curso curso)
        {
            var resultadoValidacao = await ValidarCursoAntesDeSalvar(curso);
            if (resultadoValidacao != "Ok")
            {
                return BadRequest(resultadoValidacao);
            }

            await _context.curso.AddAsync(curso);
            await _context.SaveChangesAsync();

            await CriarLog(curso.CursoId);
            
            return Ok(curso);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCurso(int id, Curso curso)
        {
            if (id != curso.CursoId)
            {
                return BadRequest("Não foi possível alterar este curso");
            }

            var resultadoValidacao = await ValidarCursoAntesDeSalvar(curso);
            if (resultadoValidacao != "Ok")
            {
                return BadRequest(resultadoValidacao);
            }

            _context.Entry(curso).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                await AtualizarLog(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CursoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DesativarCurso(int id)
        {
            var curso = await _context.curso.FindAsync(id);

            if (curso == null)
            {
                return NotFound();
            }

            if (curso.DataTermino.Date < DateTime.Now.Date)
            {
                return BadRequest("Não é possivel excluir cursos já realizados!");
            }

            curso.Ativo = false;
            _context.Entry(curso).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await AtualizarLog(id);

            return Ok();
        }

        private bool CursoExists(int id)
        {
            return (_context.curso?.Any(e => e.CursoId == id)).GetValueOrDefault();
        }

        private async Task<string> ValidarCursoAntesDeSalvar(Curso curso)
        {
            var dataAtual = DateTime.Now;

            var cadastro = await _context.curso.Where(x => (x.CategoriaId == curso.CategoriaId) && (x.Descricao == curso.Descricao) && (x.DataTermino.Date >= curso.DataInicio.Date) && (x.DataInicio.Date <= curso.DataTermino.Date) && x.Ativo == true && x.CursoId != curso.CursoId).ToListAsync();

            if (cadastro.Count() > 0)
            {
                return "Curso já cadastrado.";
            }

            if (curso.Ativo == false)
            {
                return "Não é possivel cadastrar um curso inativo.";
            }

            if (curso.DataInicio.Date < dataAtual.Date || curso.DataTermino.Date < dataAtual.Date)
            {
                return "Não é possível inserir um curso com a data menor do que hoje.";
            }

            var resultado = await _context.curso.Where(x => (x.DataTermino.Date >= curso.DataInicio.Date) && (x.DataInicio.Date <= curso.DataTermino.Date) && x.Ativo == true && x.CursoId != curso.CursoId).ToListAsync();

            if (resultado.Count() > 0)
            {
                return "Existe(m) curso(s) planejado(s) dentro do período informado.";
            }

            return "Ok";
        }

        private async Task AtualizarLog(int cursoId)
        {
            Log log = await _context.log.Where(x => x.CursoId == cursoId).FirstOrDefaultAsync();

            if (log != null)
            {
                log.Usuario = "Admin2";
                log.DataAtualizacao = DateTime.Now;
                _context.Entry(log).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        private async Task CriarLog(int cursoId) 
        {
            Log log = new Log();
            log.Usuario = "Admin";
            log.DataInclusao = DateTime.Now;
            log.DataAtualizacao = DateTime.Now;
            log.CursoId = cursoId;

            await _context.log.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }

}