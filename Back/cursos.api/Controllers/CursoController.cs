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
            var dataAtual = DateTime.Now;

            if (curso.Ativo == false)
            {
                return BadRequest("Não é possivel cadastrar um curso inativo.");
            }

            if (curso.DataInicio.Date < dataAtual.Date || curso.DataTermino.Date < dataAtual.Date)
            {
                return BadRequest("Não é possível inserir um curso com a data menor do que hoje.");
            }

            var resultado = await _context.curso.Where(x => (x.DataTermino.Date >= curso.DataInicio.Date) && (x.DataInicio.Date <= curso.DataTermino.Date) && x.Ativo == true && x.CursoId != curso.CursoId).ToListAsync();

            if (resultado.Count() > 0)
            {
                return BadRequest("Existe(m) curso(s) planejado(s) dentro do período informado.");
            }

            await _context.curso.AddAsync(curso);
            await _context.SaveChangesAsync();

            Log log = new Log();
            log.Usuario = "Admin";
            log.DataInclusao = DateTime.Now;
            log.DataAtualizacao = DateTime.Now;
            log.CursoId = curso.CursoId;

            await _context.log.AddAsync(log);
            await _context.SaveChangesAsync();
            return Ok(curso);


        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCurso(int id, Curso curso)
        {
            if (id != curso.CursoId)
            {
                return BadRequest("não editou");
            }

            var dataAtual = DateTime.Now;

            if (curso.Ativo == false)
            {
                return BadRequest("Não é possivel cadastrar um curso inativo");
            }


            if (curso.DataInicio.Date < dataAtual.Date || curso.DataTermino.Date < dataAtual.Date)
            {
                return BadRequest("Não é possível inserir um curso com a data menor do que hoje.");
            }

            var resultado = await _context.curso.Where(x => (x.DataTermino.Date >= curso.DataInicio.Date) && (x.DataInicio.Date <= curso.DataTermino.Date) && x.Ativo == true && x.CursoId != curso.CursoId).ToListAsync();

            if (resultado.Count() > 0)
            {
                return BadRequest("Existe(m) curso(s) planejado(s) dentro do período informado.");
            }

            _context.Entry(curso).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                Log log = await _context.log.Where(x => x.CursoId == id).FirstOrDefaultAsync();
                log.Usuario = "Admin2";
                log.DataAtualizacao = DateTime.Now;
                _context.Entry(log).State = EntityState.Modified;
                await _context.SaveChangesAsync();
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

        private bool CursoExists(int id)
        {
            return (_context.curso?.Any(e => e.CursoId == id)).GetValueOrDefault();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DesativarCurso(int id)
        {
            var curso = await _context.curso.FindAsync(id);
            if (curso == null)
            {
                return NotFound();
            }

            curso.Ativo = false;
            _context.Entry(curso).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            Log log = await _context.log.Where(x => x.CursoId == id).FirstOrDefaultAsync();
            log.Usuario = "Admin2";
            log.DataAtualizacao = DateTime.Now;
            _context.Entry(log).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

}