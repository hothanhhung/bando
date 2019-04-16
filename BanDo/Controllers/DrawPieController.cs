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

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public IEnumerable<DrawPie> GetAll()
        {
            var data = _context.DrawPies.Include(p=>p.Slot).ToList();
            return data;

        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public DrawPie Get(int id)
        {
            var data = _context.DrawPies.Include(p => p.Slot).Where(p => p.Id == id).FirstOrDefault();
            return data;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public void Delete(int id)
        {
            var data = _context.DrawPies.Where(p => p.Id == id).FirstOrDefault();
            _context.DrawPies.Remove(data);
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("[action]")]
        public async Task<DrawPie> Save(DrawPie drawPie)
        {
            try
            {
                var slot = drawPie.Slot;
                drawPie.Slot = null;

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
                drawPie.Slot = slot;
                return drawPie;
            }catch(Exception ex)
            {
                return null;
            }
        }

    }
}