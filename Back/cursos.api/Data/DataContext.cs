using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace cursos.api.Data
{
    public class DataContext : DbContext
    {
        public DataContext()
        {
        }
        
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Categoria> categoria { get; set; }
        public DbSet<Curso> curso { get; set; }
        public DbSet<Log> log { get; set; }
    }
}