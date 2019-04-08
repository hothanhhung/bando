using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BanDo.Data;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;

namespace BanDo.Controllers
{
    public class HomeController : Controller
    {
        private readonly QuanLyContext _context;

        public HomeController(QuanLyContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            ViewBag.Shapes = Newtonsoft.Json.JsonConvert.SerializeObject(_context.DrawPies.Include(p=>p.Slot).ToList());
            return View();
        }
    }
}