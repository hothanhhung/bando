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
        public DbSet<DrawPie> DrawPies { get; set; }
        public DbSet<DrawPieImage> DrawPieImages { get; set; }
        public DbSet<Slot> Slots { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}
