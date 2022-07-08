using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using cursos.api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace cursos.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : Controller
    {
        private readonly DataContext _context;

        public CategoriaController(DataContext context)
        {
            _context = context;
        }

         [HttpGet]
        public IEnumerable<Categoria> Get()
        {
            return _context.categoria;
        }


    }
}