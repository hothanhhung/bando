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
    public class DrawPieImageController : ControllerBase
    {
        private readonly QuanLyContext _context;

        public DrawPieImageController(QuanLyContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public IEnumerable<DrawPieImage> GetAll()
        {
            var data = _context.DrawPieImages.Include(p => p.Slot).ToList();
            return data;

        }

        [HttpGet("[action]")]
        public DrawPieImage Get(int id)
        {
            var data = _context.DrawPieImages.Include(p => p.Slot).Where(p => p.Id == id).FirstOrDefault();
            return data;
        }

        [HttpGet("[action]")]
        public void Delete(int id)
        {
            var data = _context.DrawPieImages.Where(p => p.Id == id).FirstOrDefault();
            _context.DrawPieImages.Remove(data);
            _context.SaveChanges();
        }

        [HttpPost("[action]")]
        public async Task<DrawPieImage> Save(DrawPieImage drawPie)
        {
            try
            {
                var slot = drawPie.Slot;
                drawPie.Slot = null;
                var data = _context.DrawPieImages.AsNoTracking().Where(p => p.Id == drawPie.Id).FirstOrDefault();
                if (data == null)
                {
                    drawPie.AddedDate = DateTime.Now;
                    drawPie.UpdatedDate = DateTime.Now;
                    var rs = _context.DrawPieImages.Add(drawPie);
                    drawPie = rs.Entity;
                }
                else
                {
                    drawPie.UpdatedDate = DateTime.Now;
                    var rs = _context.DrawPieImages.Update(drawPie);
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