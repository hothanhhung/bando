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
    [Authorize]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly QuanLyContext _context;

        public UserController(QuanLyContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public IEnumerable<User> GetAll()
        {
            var data = _context.Users.ToList();
            return data;

        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public User Get(string username)
        {
            var data = _context.Users.Where(p=>p.Username == username).FirstOrDefault();
            return data;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public void Delete(string username)
        {
            var data = _context.Users.Where(p => p.Username == username).FirstOrDefault();
            _context.Users.Remove(data);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("[action]")]
        public async Task<User> Save(User user)
        {
            try
            {
                var data = _context.Users.AsNoTracking().Where(p => p.Username == user.Username).FirstOrDefault();
                if (data == null)
                {
                    user.AddedDate = DateTime.Now;
                    user.UpdatedDate = DateTime.Now;
                    var rs = _context.Users.Add(user);
                    user = rs.Entity;
                }
                else
                {
                    user.UpdatedDate = DateTime.Now;
                    var rs = _context.Users.Update(user);
                    user = rs.Entity;
                }
                await _context.SaveChangesAsync();
                return user;
            }catch(Exception ex)
            {
                return null;
            }
        }

    }
}