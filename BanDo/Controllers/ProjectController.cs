using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BanDo.Data;
using BanDo.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BanDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly QuanLyContext _context;

        public ProjectController(QuanLyContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public IEnumerable<Product> GetAll()
        {
            var data = _context.Products.ToList();
            return data;

        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public Product Get(int id)
        {
            var data = _context.Products.Where(p=>p.Id == id).FirstOrDefault();
            return data;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public void Delete(int id)
        {
            var data = _context.Products.Where(p => p.Id == id).FirstOrDefault();
            _context.Products.Remove(data);
            //await _context.SaveChangesAsync();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("[action]")]
        public async Task<Product> Save(Product product)
        {
            try
            {
                var data = _context.Products.AsNoTracking().Where(p => p.Id == product.Id).FirstOrDefault();
                if (data == null)
                {
                    product.AddedDate = DateTime.Now;
                    product.UpdatedDate = DateTime.Now;
                    var rs = _context.Products.Add(product);
                    product = rs.Entity;
                }
                else
                {
                    product.UpdatedDate = DateTime.Now;
                    var rs = _context.Products.Update(product);
                    product = rs.Entity;
                }
                await _context.SaveChangesAsync();
                return product;
            }catch(Exception ex)
            {
                return null;
            }
        }

    }
}