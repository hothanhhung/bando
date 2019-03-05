using System;
using System.ComponentModel.DataAnnotations;

namespace BanDo.Models
{
    public class User
    {
        [Key]
        public string Username {get; set;}
        public string Password { get; set; }
        public string Name { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
