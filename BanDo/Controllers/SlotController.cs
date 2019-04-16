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
    public class SlotController : ControllerBase
    {
        private readonly QuanLyContext _context;

        public SlotController(QuanLyContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public IEnumerable<Slot> GetAll()
        {
            var data = _context.Slots.ToList();
            return data;

        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public IEnumerable<Slot> GetAllByProject(int projectId)
        {
            var data = _context.Slots.Where(p=>p.ProductId.HasValue && p.ProductId.Value == projectId).ToList();
            return data;

        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public Slot Get(int id)
        {
            var data = _context.Slots.Where(p => p.Id == id).FirstOrDefault();
            return data;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public void Delete(int id)
        {
            var data = _context.Slots.Where(p => p.Id == id).FirstOrDefault();
            _context.Slots.Remove(data);
            _context.SaveChanges();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("[action]")]
        public async Task<Slot> Save(Slot slot)
        {
            try
            {
                var data = _context.Slots.AsNoTracking().Where(p => p.Id == slot.Id).FirstOrDefault();
                if (data == null)
                {
                    slot.AddedDate = DateTime.Now;
                    slot.UpdatedDate = DateTime.Now;
                    var rs = _context.Slots.Add(slot);
                    slot = rs.Entity;
                }
                else
                {
                    slot.UpdatedDate = DateTime.Now;
                    var rs = _context.Slots.Update(slot);
                    slot = rs.Entity;
                }
                await _context.SaveChangesAsync();
                return slot;
            }catch(Exception ex)
            {
                return null;
            }
        }

    }
}