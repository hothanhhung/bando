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
    [AllowAnonymous]
    [ApiController]
    public class DrawPieController : ControllerBase
    {
        private readonly QuanLyContext _context;

        public DrawPieController(QuanLyContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public IEnumerable<DrawPie> GetAll()
        {
            var data = _context.DrawPies.ToList();
            return data;

        }

        [HttpGet("[action]")]
        public DrawPie Get(int id)
        {
            var data = _context.DrawPies.Where(p => p.Id == id).FirstOrDefault();
            return data;
        }

        [HttpGet("[action]")]
        public void Delete(int id)
        {
            var data = _context.DrawPies.Where(p => p.Id == id).FirstOrDefault();
            _context.DrawPies.Remove(data);
            _context.SaveChanges();
        }

        [HttpPost("[action]")]
        public async Task<DrawPie> Save(DrawPie drawPie)
        {
            try
            {
                var data = _context.DrawPies.AsNoTracking().Where(p => p.Id == drawPie.Id).FirstOrDefault();
                if (data == null)
                {
                    drawPie.AddedDate = DateTime.Now;
                    drawPie.UpdatedDate = DateTime.Now;
                    var rs = _context.DrawPies.Add(drawPie);
                    drawPie = rs.Entity;
                }
                else
                {
                    drawPie.UpdatedDate = DateTime.Now;
                    var rs = _context.DrawPies.Update(drawPie);
                    drawPie = rs.Entity;
                }
                await _context.SaveChangesAsync();
                return drawPie;
            }catch(Exception ex)
            {
                return null;
            }
        }

    }
}