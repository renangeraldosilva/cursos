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
        public IEnumerable<Curso> Get()
        {
            return _context.curso.Where(curso => curso.Ativo == true);
        }

        [HttpGet("{id}")]

        public Curso GetById(int id)
        {
            return _context.curso.Where(curso => curso.CursoId == id && curso.Ativo == true).FirstOrDefault();

        }

        [HttpPost]
        public async Task<ActionResult<Curso>> PostCurso(Curso curso)
        {
            await _context.curso.AddAsync(curso);
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

            _context.Entry(curso).State = EntityState.Modified;

            try
            {
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

            return Ok();
        }
    }

}