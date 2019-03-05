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
    public class CustomerController : ControllerBase
    {
        private readonly QuanLyContext _context;

        public CustomerController(QuanLyContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public IEnumerable<Customer> GetAll()
        {
            var data = _context.Customers.ToList();
            return data;

        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public Customer Get(int customerId)
        {
            var data = _context.Customers.Where(p=>p.Id == customerId).FirstOrDefault();
            return data;
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("[action]")]
        public void Delete(int id)
        {
            var data = _context.Customers.Where(p => p.Id == id).FirstOrDefault();
            _context.Customers.Remove(data);
            //await _context.SaveChangesAsync();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("[action]")]
        public async Task<Customer> Save(Customer customer)
        {
            try
            {
                var data = _context.Customers.AsNoTracking().Where(p => p.Id == customer.Id).FirstOrDefault();
                if (data == null)
                {
                    customer.AddedDate = DateTime.Now;
                    customer.UpdatedDate = DateTime.Now;
                    var rs = _context.Customers.Add(customer);
                    customer = rs.Entity;
                }
                else
                {
                    customer.UpdatedDate = DateTime.Now;
                    var rs = _context.Customers.Update(customer);
                    customer = rs.Entity;
                }
                await _context.SaveChangesAsync();
                return customer;
            }catch(Exception ex)
            {
                return null;
            }
        }

    }
}