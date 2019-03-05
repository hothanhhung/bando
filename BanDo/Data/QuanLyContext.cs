using BanDo.Models;
using Microsoft.EntityFrameworkCore;

namespace BanDo.Data
{
    public class QuanLyContext : DbContext
    {
        public QuanLyContext(DbContextOptions<QuanLyContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
